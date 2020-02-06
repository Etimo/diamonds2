#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("symbol-observable");
// symbol polyfill must go first
// tslint:disable-next-line:ordered-imports import-groups
const core_1 = require("@angular-devkit/core");
const node_1 = require("@angular-devkit/core/node");
const schematics_1 = require("@angular-devkit/schematics");
const tools_1 = require("@angular-devkit/schematics/tools");
const inquirer = require("inquirer");
const minimist = require("minimist");
/**
 * Parse the name of schematic passed in argument, and return a {collection, schematic} named
 * tuple. The user can pass in `collection-name:schematic-name`, and this function will either
 * return `{collection: 'collection-name', schematic: 'schematic-name'}`, or it will error out
 * and show usage.
 *
 * In the case where a collection name isn't part of the argument, the default is to use the
 * schematics package (@schematics/schematics) as the collection.
 *
 * This logic is entirely up to the tooling.
 *
 * @param str The argument to parse.
 * @return {{collection: string, schematic: (string)}}
 */
function parseSchematicName(str) {
    let collection = '@schematics/schematics';
    let schematic = str;
    if (schematic && schematic.indexOf(':') != -1) {
        [collection, schematic] = schematic.split(':', 2);
    }
    return { collection, schematic };
}
function _listSchematics(collectionName, logger) {
    try {
        const engineHost = new tools_1.NodeModulesEngineHost();
        const engine = new schematics_1.SchematicEngine(engineHost);
        const collection = engine.createCollection(collectionName);
        logger.info(engine.listSchematicNames(collection).join('\n'));
    }
    catch (error) {
        logger.fatal(error.message);
        return 1;
    }
    return 0;
}
function _createPromptProvider() {
    return (definitions) => {
        const questions = definitions.map(definition => {
            const question = {
                name: definition.id,
                message: definition.message,
                default: definition.default,
            };
            const validator = definition.validator;
            if (validator) {
                question.validate = input => validator(input);
            }
            switch (definition.type) {
                case 'confirmation':
                    return Object.assign({}, question, { type: 'confirm' });
                case 'list':
                    return Object.assign({}, question, { type: !!definition.multiselect ? 'checkbox' : 'list', choices: definition.items && definition.items.map(item => {
                            if (typeof item == 'string') {
                                return item;
                            }
                            else {
                                return {
                                    name: item.label,
                                    value: item.value,
                                };
                            }
                        }) });
                default:
                    return Object.assign({}, question, { type: definition.type });
            }
        });
        return inquirer.prompt(questions);
    };
}
async function main({ args, stdout = process.stdout, stderr = process.stderr, }) {
    const argv = parseArgs(args);
    /** Create the DevKit Logger used through the CLI. */
    const logger = node_1.createConsoleLogger(argv['verbose'], stdout, stderr);
    if (argv.help) {
        logger.info(getUsage());
        return 0;
    }
    /** Get the collection an schematic name from the first argument. */
    const { collection: collectionName, schematic: schematicName, } = parseSchematicName(argv._.shift() || null);
    const isLocalCollection = collectionName.startsWith('.') || collectionName.startsWith('/');
    /** If the user wants to list schematics, we simply show all the schematic names. */
    if (argv['list-schematics']) {
        return _listSchematics(collectionName, logger);
    }
    if (!schematicName) {
        logger.info(getUsage());
        return 1;
    }
    /** Gather the arguments for later use. */
    const debug = argv.debug === null ? isLocalCollection : argv.debug;
    const dryRun = argv['dry-run'] === null ? debug : argv['dry-run'];
    const force = argv['force'];
    const allowPrivate = argv['allow-private'];
    /** Create a Virtual FS Host scoped to where the process is being run. **/
    const fsHost = new core_1.virtualFs.ScopedHost(new node_1.NodeJsSyncHost(), core_1.normalize(process.cwd()));
    /** Create the workflow that will be executed with this run. */
    const workflow = new tools_1.NodeWorkflow(fsHost, { force, dryRun });
    // Indicate to the user when nothing has been done. This is automatically set to off when there's
    // a new DryRunEvent.
    let nothingDone = true;
    // Logging queue that receives all the messages to show the users. This only get shown when no
    // errors happened.
    let loggingQueue = [];
    let error = false;
    /**
     * Logs out dry run events.
     *
     * All events will always be executed here, in order of discovery. That means that an error would
     * be shown along other events when it happens. Since errors in workflows will stop the Observable
     * from completing successfully, we record any events other than errors, then on completion we
     * show them.
     *
     * This is a simple way to only show errors when an error occur.
     */
    workflow.reporter.subscribe((event) => {
        nothingDone = false;
        switch (event.kind) {
            case 'error':
                error = true;
                const desc = event.description == 'alreadyExist' ? 'already exists' : 'does not exist';
                logger.warn(`ERROR! ${event.path} ${desc}.`);
                break;
            case 'update':
                loggingQueue.push(core_1.tags.oneLine `
        ${core_1.terminal.white('UPDATE')} ${event.path} (${event.content.length} bytes)
      `);
                break;
            case 'create':
                loggingQueue.push(core_1.tags.oneLine `
        ${core_1.terminal.green('CREATE')} ${event.path} (${event.content.length} bytes)
      `);
                break;
            case 'delete':
                loggingQueue.push(`${core_1.terminal.yellow('DELETE')} ${event.path}`);
                break;
            case 'rename':
                loggingQueue.push(`${core_1.terminal.blue('RENAME')} ${event.path} => ${event.to}`);
                break;
        }
    });
    /**
     * Listen to lifecycle events of the workflow to flush the logs between each phases.
     */
    workflow.lifeCycle.subscribe(event => {
        if (event.kind == 'workflow-end' || event.kind == 'post-tasks-start') {
            if (!error) {
                // Flush the log queue and clean the error state.
                loggingQueue.forEach(log => logger.info(log));
            }
            loggingQueue = [];
            error = false;
        }
    });
    /**
     * Remove every options from argv that we support in schematics itself.
     */
    const parsedArgs = Object.assign({}, argv);
    delete parsedArgs['--'];
    for (const key of booleanArgs) {
        delete parsedArgs[key];
    }
    /**
     * Add options from `--` to args.
     */
    const argv2 = minimist(argv['--']);
    for (const key of Object.keys(argv2)) {
        parsedArgs[key] = argv2[key];
    }
    // Pass the rest of the arguments as the smart default "argv". Then delete it.
    workflow.registry.addSmartDefaultProvider('argv', (schema) => {
        if ('index' in schema) {
            return argv._[Number(schema['index'])];
        }
        else {
            return argv._;
        }
    });
    delete parsedArgs._;
    // Add prompts.
    workflow.registry.usePromptProvider(_createPromptProvider());
    /**
     *  Execute the workflow, which will report the dry run events, run the tasks, and complete
     *  after all is done.
     *
     *  The Observable returned will properly cancel the workflow if unsubscribed, error out if ANY
     *  step of the workflow failed (sink or task), with details included, and will only complete
     *  when everything is done.
     */
    try {
        await workflow.execute({
            collection: collectionName,
            schematic: schematicName,
            options: parsedArgs,
            allowPrivate: allowPrivate,
            debug: debug,
            logger: logger,
        })
            .toPromise();
        if (nothingDone) {
            logger.info('Nothing to be done.');
        }
        return 0;
    }
    catch (err) {
        if (err instanceof schematics_1.UnsuccessfulWorkflowExecution) {
            // "See above" because we already printed the error.
            logger.fatal('The Schematic workflow failed. See above.');
        }
        else if (debug) {
            logger.fatal('An error occured:\n' + err.stack);
        }
        else {
            logger.fatal(err.stack || err.message);
        }
        return 1;
    }
}
exports.main = main;
/**
* Get usage of the CLI tool.
*/
function getUsage() {
    return core_1.tags.stripIndent `
  schematics [CollectionName:]SchematicName [options, ...]

  By default, if the collection name is not specified, use the internal collection provided
  by the Schematics CLI.

  Options:
      --debug             Debug mode. This is true by default if the collection is a relative
                          path (in that case, turn off with --debug=false).

      --allow-private     Allow private schematics to be run from the command line. Default to
                          false.

      --dry-run           Do not output anything, but instead just show what actions would be
                          performed. Default to true if debug is also true.

      --force             Force overwriting files that would otherwise be an error.

      --list-schematics   List all schematics from the collection, by name. A collection name
                          should be suffixed by a colon. Example: '@schematics/schematics:'.

      --verbose           Show more information.

      --help              Show this message.

  Any additional option is passed to the Schematics depending on
  `;
}
/** Parse the command line. */
const booleanArgs = [
    'allowPrivate',
    'allow-private',
    'debug',
    'dry-run',
    'dryRun',
    'force',
    'help',
    'list-schematics',
    'listSchematics',
    'verbose',
];
function parseArgs(args) {
    return minimist(args, {
        boolean: booleanArgs,
        alias: {
            'dryRun': 'dry-run',
            'listSchematics': 'list-schematics',
            'allowPrivate': 'allow-private',
        },
        default: {
            'debug': null,
            'dryRun': null,
        },
        '--': true,
    });
}
if (require.main === module) {
    const args = process.argv.slice(2);
    main({ args })
        .then(exitCode => process.exitCode = exitCode)
        .catch(e => { throw (e); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hdGljcy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljc19jbGkvYmluL3NjaGVtYXRpY3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBU0EsNkJBQTJCO0FBQzNCLGdDQUFnQztBQUNoQyx5REFBeUQ7QUFDekQsK0NBUThCO0FBQzlCLG9EQUErRjtBQUMvRiwyREFJb0M7QUFDcEMsNERBQXVGO0FBQ3ZGLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFHckM7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQVMsa0JBQWtCLENBQUMsR0FBa0I7SUFDNUMsSUFBSSxVQUFVLEdBQUcsd0JBQXdCLENBQUM7SUFFMUMsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3BCLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7UUFDN0MsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDbkQ7SUFFRCxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFVRCxTQUFTLGVBQWUsQ0FBQyxjQUFzQixFQUFFLE1BQXNCO0lBQ3JFLElBQUk7UUFDRixNQUFNLFVBQVUsR0FBRyxJQUFJLDZCQUFxQixFQUFFLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSw0QkFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUMvRDtJQUFDLE9BQU8s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OUIsTUFBTSxXQUFXLEdBQUc7SUFDbEIsY0FBYztJQUNkLGVBQWU7SUFDZixPQUFPO0lBQ1AsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsU0FBUztDQUNWLENBQUM7QUFFRixTQUFTLFNBQVMsQ0FBQyxJQUEwQjtJQUN6QyxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDcEIsT0FBTyxFQUFFLFdBQVc7UUFDcEIsS0FBSyxFQUFFO1lBQ0wsUUFBUSxFQUFFLFNBQVM7WUFDbkIsZ0JBQWdCLEVBQUUsaUJBQWlCO1lBQ25DLGNBQWMsRUFBRSxlQUFlO1NBQ2hDO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLElBQUk7WUFDYixRQUFRLEVBQUUsSUFBSTtTQUNmO1FBQ0QsSUFBSSxFQUFFLElBQUk7S0FDWCxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUMzQixNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQzdDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQy9CIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgJ3N5bWJvbC1vYnNlcnZhYmxlJztcbi8vIHN5bWJvbCBwb2x5ZmlsbCBtdXN0IGdvIGZpcnN0XG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6b3JkZXJlZC1pbXBvcnRzIGltcG9ydC1ncm91cHNcbmltcG9ydCB7XG4gIEpzb25PYmplY3QsXG4gIGxvZ2dpbmcsXG4gIG5vcm1hbGl6ZSxcbiAgc2NoZW1hLFxuICB0YWdzLFxuICB0ZXJtaW5hbCxcbiAgdmlydHVhbEZzLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBOb2RlSnNTeW5jSG9zdCwgUHJvY2Vzc091dHB1dCwgY3JlYXRlQ29uc29sZUxvZ2dlciB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL25vZGUnO1xuaW1wb3J0IHtcbiAgRHJ5UnVuRXZlbnQsXG4gIFNjaGVtYXRpY0VuZ2luZSxcbiAgVW5zdWNjZXNzZnVsV29ya2Zsb3dFeGVjdXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IE5vZGVNb2R1bGVzRW5naW5lSG9zdCwgTm9kZVdvcmtmbG93IH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMnO1xuaW1wb3J0ICogYXMgaW5xdWlyZXIgZnJvbSAnaW5xdWlyZXInO1xuaW1wb3J0ICogYXMgbWluaW1pc3QgZnJvbSAnbWluaW1pc3QnO1xuXG5cbi8qKlxuICogUGFyc2UgdGhlIG5hbWUgb2Ygc2NoZW1hdGljIHBhc3NlZCBpbiBhcmd1bWVudCwgYW5kIHJldHVybiBhIHtjb2xsZWN0aW9uLCBzY2hlbWF0aWN9IG5hbWVkXG4gKiB0dXBsZS4gVGhlIHVzZXIgY2FuIHBhc3MgaW4gYGNvbGxlY3Rpb24tbmFtZTpzY2hlbWF0aWMtbmFtZWAsIGFuZCB0aGlzIGZ1bmN0aW9uIHdpbGwgZWl0aGVyXG4gKiByZXR1cm4gYHtjb2xsZWN0aW9uOiAnY29sbGVjdGlvbi1uYW1lJywgc2NoZW1hdGljOiAnc2NoZW1hdGljLW5hbWUnfWAsIG9yIGl0IHdpbGwgZXJyb3Igb3V0XG4gKiBhbmQgc2hvdyB1c2FnZS5cbiAqXG4gKiBJbiB0aGUgY2FzZSB3aGVyZSBhIGNvbGxlY3Rpb24gbmFtZSBpc24ndCBwYXJ0IG9mIHRoZSBhcmd1bWVudCwgdGhlIGRlZmF1bHQgaXMgdG8gdXNlIHRoZVxuICogc2NoZW1hdGljcyBwYWNrYWdlIChAc2NoZW1hdGljcy9zY2hlbWF0aWNzKSBhcyB0aGUgY29sbGVjdGlvbi5cbiAqXG4gKiBUaGlzIGxvZ2ljIGlzIGVudGlyZWx5IHVwIHRvIHRoZSB0b29saW5nLlxuICpcbiAqIEBwYXJhbSBzdHIgVGhlIGFyZ3VtZW50IHRvIHBhcnNlLlxuICogQHJldHVybiB7e2NvbGxlY3Rpb246IHN0cmluZywgc2NoZW1hdGljOiAoc3RyaW5nKX19XG4gKi9cbmZ1bmN0aW9uIHBhcnNlU2NoZW1hdGljTmFtZShzdHI6IHN0cmluZyB8IG51bGwpOiB7IGNvbGxlY3Rpb246IHN0cmluZywgc2NoZW1hdGljOiBzdHJpbmcgfCBudWxsIH0ge1xuICBsZXQgY29sbGVjdGlvbiA9ICdAc2NoZW1hdGljcy9zY2hlbWF0aWNzJztcblxuICBsZXQgc2NoZW1hdGljID0gc3RyO1xuICBpZiAoc2NoZW1hdGljICYmIHNjaGVtYXRpYy5pbmRleE9mKCc6JykgIT0gLTEpIHtcbiAgICBbY29sbGVjdGlvbiwgc2NoZW1hdGljXSA9IHNjaGVtYXRpYy5zcGxpdCgnOicsIDIpO1xuICB9XG5cbiAgcmV0dXJuIHsgY29sbGVjdGlvbiwgc2NoZW1hdGljIH07XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBNYWluT3B0aW9ucyB7XG4gIGFyZ3M6IHN0cmluZ1tdO1xuICBzdGRvdXQ/OiBQcm9jZXNzT3V0cHV0O1xuICBzdGRlcnI/OiBQcm9jZXNzT3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIF9saXN0U2NoZW1hdGljcyhjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW5naW5lSG9zdCA9IG5ldyBOb2RlTW9kdWxlc0VuZ2luZUhvc3QoKTtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgU2NoZW1hdGljRW5naW5lKGVuZ2luZUhvc3QpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBlbmdpbmUuY3JlYXRlQ29sbGVjdGlvbihjb2xsZWN0aW9uTmFtZSk7XG4gICAgbG9nZ2VyLmluZm8oZW5naW5lLmxpc3RTY2hlbWF0aWNOYW1lcyhjb2xsZWN0aW9uKS5qb2luKCdcXG4nKSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmZhdGFsKGVycm9yLm1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuZnVuY3Rpb24gX2NyZWF0ZVByb21wdFByb3ZpZGVyKCk6IHNjaGVtYS5Qcm9tcHRQcm92aWRlciB7XG4gIHJldHVybiAoZGVmaW5pdGlvbnM6IEFycmF5PHNjaGVtYS5Qcm9tcHREZWZpbml0aW9uPikgPT4ge1xuICAgIGNvbnN0IHF1ZXN0aW9uczogaW5xdWlyZXIuUXVlc3Rpb25zID0gZGVmaW5pdGlvbnMubWFwKGRlZmluaXRpb24gPT4ge1xuICAgICAgY29uc3QgcXVlc3Rpb246IGlucXVpcmVyLlF1ZXN0aW9uID0ge1xuICAgICAgICBuYW1lOiBkZWZpbml0aW9uLmlkLFxuICAgICAgICBtZXNzYWdlOiBkZWZpbml0aW9uLm1lc3NhZ2UsXG4gICAgICAgIGRlZmF1bHQ6IGRlZmluaXRpb24uZGVmYXVsdCxcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHZhbGlkYXRvciA9IGRlZmluaXRpb24udmFsaWRhdG9yO1xuICAgICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgICBxdWVzdGlvbi52YWxpZGF0ZSA9IGlucHV0ID0+IHZhbGlkYXRvcihpbnB1dCk7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoZGVmaW5pdGlvbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NvbmZpcm1hdGlvbic6XG4gICAgICAgICAgcmV0dXJuIHsgLi4ucXVlc3Rpb24sIHR5cGU6ICdjb25maXJtJyB9O1xuICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucXVlc3Rpb24sXG4gICAgICAgICAgICB0eXBlOiAhIWRlZmluaXRpb24ubXVsdGlzZWxlY3QgPyAnY2hlY2tib3gnIDogJ2xpc3QnLFxuICAgICAgICAgICAgY2hvaWNlczogZGVmaW5pdGlvbi5pdGVtcyAmJiBkZWZpbml0aW9uLml0ZW1zLm1hcChpdGVtID0+IHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpdGVtID09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGl0ZW0ubGFiZWwsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogaXRlbS52YWx1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHJldHVybiB7IC4uLnF1ZXN0aW9uLCB0eXBlOiBkZWZpbml0aW9uLnR5cGUgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb25zKTtcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4oe1xuICBhcmdzLFxuICBzdGRvdXQgPSBwcm9jZXNzLnN0ZG91dCxcbiAgc3RkZXJyID0gcHJvY2Vzcy5zdGRlcnIsXG59OiBNYWluT3B0aW9ucyk6IFByb21pc2U8MCB8IDE+IHtcbiAgY29uc3QgYXJndiA9IHBhcnNlQXJncyhhcmdzKTtcblxuICAvKiogQ3JlYXRlIHRoZSBEZXZLaXQgTG9nZ2VyIHVzZWQgdGhyb3VnaCB0aGUgQ0xJLiAqL1xuICBjb25zdCBsb2dnZXIgPSBjcmVhdGVDb25zb2xlTG9nZ2VyKGFyZ3ZbJ3ZlcmJvc2UnXSwgc3Rkb3V0LCBzdGRlcnIpO1xuICBpZiAoYXJndi5oZWxwKSB7XG4gICAgbG9nZ2VyLmluZm8oZ2V0VXNhZ2UoKSk7XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKiBHZXQgdGhlIGNvbGxlY3Rpb24gYW4gc2NoZW1hdGljIG5hbWUgZnJvbSB0aGUgZmlyc3QgYXJndW1lbnQuICovXG4gIGNvbnN0IHtcbiAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZSxcbiAgICBzY2hlbWF0aWM6IHNjaGVtYXRpY05hbWUsXG4gIH0gPSBwYXJzZVNjaGVtYXRpY05hbWUoYXJndi5fLnNoaWZ0KCkgfHwgbnVsbCk7XG4gIGNvbnN0IGlzTG9jYWxDb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWUuc3RhcnRzV2l0aCgnLicpIHx8IGNvbGxlY3Rpb25OYW1lLnN0YXJ0c1dpdGgoJy8nKTtcblxuICAvKiogSWYgdGhlIHVzZXIgd2FudHMgdG8gbGlzdCBzY2hlbWF0aWNzLCB3ZSBzaW1wbHkgc2hvdyBhbGwgdGhlIHNjaGVtYXRpYyBuYW1lcy4gKi9cbiAgaWYgKGFyZ3ZbJ2xpc3Qtc2NoZW1hdGljcyddKSB7XG4gICAgcmV0dXJuIF9saXN0U2NoZW1hdGljcyhjb2xsZWN0aW9uTmFtZSwgbG9nZ2VyKTtcbiAgfVxuXG4gIGlmICghc2NoZW1hdGljTmFtZSkge1xuICAgIGxvZ2dlci5pbmZvKGdldFVzYWdlKCkpO1xuXG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvKiogR2F0aGVyIHRoZSBhcmd1bWVudHMgZm9yIGxhdGVyIHVzZS4gKi9cbiAgY29uc3QgZGVidWc6IGJvb2xlYW4gPSBhcmd2LmRlYnVnID09PSBudWxsID8gaXNMb2NhbENvbGxlY3Rpb24gOiBhcmd2LmRlYnVnO1xuICBjb25zdCBkcnlSdW46IGJvb2xlYW4gPSBhcmd2WydkcnktcnVuJ10gPT09IG51bGwgPyBkZWJ1ZyA6IGFyZ3ZbJ2RyeS1ydW4nXTtcbiAgY29uc3QgZm9yY2UgPSBhcmd2Wydmb3JjZSddO1xuICBjb25zdCBhbGxvd1ByaXZhdGUgPSBhcmd2WydhbGxvdy1wcml2YXRlJ107XG5cbiAgLyoqIENyZWF0ZSBhIFZpcnR1YWwgRlMgSG9zdCBzY29wZWQgdG8gd2hlcmUgdGhlIHByb2Nlc3MgaXMgYmVpbmcgcnVuLiAqKi9cbiAgY29uc3QgZnNIb3N0ID0gbmV3IHZpcnR1YWxGcy5TY29wZWRIb3N0KG5ldyBOb2RlSnNTeW5jSG9zdCgpLCBub3JtYWxpemUocHJvY2Vzcy5jd2QoKSkpO1xuXG4gIC8qKiBDcmVhdGUgdGhlIHdvcmtmbG93IHRoYXQgd2lsbCBiZSBleGVjdXRlZCB3aXRoIHRoaXMgcnVuLiAqL1xuICBjb25zdCB3b3JrZmxvdyA9IG5ldyBOb2RlV29ya2Zsb3coZnNIb3N0LCB7IGZvcmNlLCBkcnlSdW4gfSk7XG5cbiAgLy8gSW5kaWNhdGUgdG8gdGhlIHVzZXIgd2hlbiBub3RoaW5nIGhhcyBiZWVuIGRvbmUuIFRoaXMgaXMgYXV0b21hdGljYWxseSBzZXQgdG8gb2ZmIHdoZW4gdGhlcmUnc1xuICAvLyBhIG5ldyBEcnlSdW5FdmVudC5cbiAgbGV0IG5vdGhpbmdEb25lID0gdHJ1ZTtcblxuICAvLyBMb2dnaW5nIHF1ZXVlIHRoYXQgcmVjZWl2ZXMgYWxsIHRoZSBtZXNzYWdlcyB0byBzaG93IHRoZSB1c2Vycy4gVGhpcyBvbmx5IGdldCBzaG93biB3aGVuIG5vXG4gIC8vIGVycm9ycyBoYXBwZW5lZC5cbiAgbGV0IGxvZ2dpbmdRdWV1ZTogc3RyaW5nW10gPSBbXTtcbiAgbGV0IGVycm9yID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIExvZ3Mgb3V0IGRyeSBydW4gZXZlbnRzLlxuICAgKlxuICAgKiBBbGwgZXZlbnRzIHdpbGwgYWx3YXlzIGJlIGV4ZWN1dGVkIGhlcmUsIGluIG9yZGVyIG9mIGRpc2NvdmVyeS4gVGhhdCBtZWFucyB0aGF0IGFuIGVycm9yIHdvdWxkXG4gICAqIGJlIHNob3duIGFsb25nIG90aGVyIGV2ZW50cyB3aGVuIGl0IGhhcHBlbnMuIFNpbmNlIGVycm9ycyBpbiB3b3JrZmxvd3Mgd2lsbCBzdG9wIHRoZSBPYnNlcnZhYmxlXG4gICAqIGZyb20gY29tcGxldGluZyBzdWNjZXNzZnVsbHksIHdlIHJlY29yZCBhbnkgZXZlbnRzIG90aGVyIHRoYW4gZXJyb3JzLCB0aGVuIG9uIGNvbXBsZXRpb24gd2VcbiAgICogc2hvdyB0aGVtLlxuICAgKlxuICAgKiBUaGlzIGlzIGEgc2ltcGxlIHdheSB0byBvbmx5IHNob3cgZXJyb3JzIHdoZW4gYW4gZXJyb3Igb2NjdXIuXG4gICAqL1xuICB3b3JrZmxvdy5yZXBvcnRlci5zdWJzY3JpYmUoKGV2ZW50OiBEcnlSdW5FdmVudCkgPT4ge1xuICAgIG5vdGhpbmdEb25lID0gZmFsc2U7XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtpbmQpIHtcbiAgICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGRlc2MgPSBldmVudC5kZXNjcmlwdGlvbiA9PSAnYWxyZWFkeUV4aXN0JyA/ICdhbHJlYWR5IGV4aXN0cycgOiAnZG9lcyBub3QgZXhpc3QnO1xuICAgICAgICBsb2dnZXIud2FybihgRVJST1IhICR7ZXZlbnQucGF0aH0gJHtkZXNjfS5gKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd1cGRhdGUnOlxuICAgICAgICBsb2dnaW5nUXVldWUucHVzaCh0YWdzLm9uZUxpbmVgXG4gICAgICAgICR7dGVybWluYWwud2hpdGUoJ1VQREFURScpfSAke2V2ZW50LnBhdGh9ICgke2V2ZW50LmNvbnRlbnQubGVuZ3RofSBieXRlcylcbiAgICAgIGApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NyZWF0ZSc6XG4gICAgICAgIGxvZ2dpbmdRdWV1ZS5wdXNoKHRhZ3Mub25lTGluZWBcbiAgICAgICAgJHt0ZXJtaW5hbC5ncmVlbignQ1JFQVRFJyl9ICR7ZXZlbnQucGF0aH0gKCR7ZXZlbnQuY29udGVudC5sZW5ndGh9IGJ5dGVzKVxuICAgICAgYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZGVsZXRlJzpcbiAgICAgICAgbG9nZ2luZ1F1ZXVlLnB1c2goYCR7dGVybWluYWwueWVsbG93KCdERUxFVEUnKX0gJHtldmVudC5wYXRofWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3JlbmFtZSc6XG4gICAgICAgIGxvZ2dpbmdRdWV1ZS5wdXNoKGAke3Rlcm1pbmFsLmJsdWUoJ1JFTkFNRScpfSAke2V2ZW50LnBhdGh9ID0+ICR7ZXZlbnQudG99YCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogTGlzdGVuIHRvIGxpZmVjeWNsZSBldmVudHMgb2YgdGhlIHdvcmtmbG93IHRvIGZsdXNoIHRoZSBsb2dzIGJldHdlZW4gZWFjaCBwaGFzZXMuXG4gICAqL1xuICB3b3JrZmxvdy5saWZlQ3ljbGUuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICBpZiAoZXZlbnQua2luZCA9PSAnd29ya2Zsb3ctZW5kJyB8fCBldmVudC5raW5kID09ICdwb3N0LXRhc2tzLXN0YXJ0Jykge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICAvLyBGbHVzaCB0aGUgbG9nIHF1ZXVlIGFuZCBjbGVhbiB0aGUgZXJyb3Igc3RhdGUuXG4gICAgICAgIGxvZ2dpbmdRdWV1ZS5mb3JFYWNoKGxvZyA9PiBsb2dnZXIuaW5mbyhsb2cpKTtcbiAgICAgIH1cblxuICAgICAgbG9nZ2luZ1F1ZXVlID0gW107XG4gICAgICBlcnJvciA9IGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZXJ5IG9wdGlvbnMgZnJvbSBhcmd2IHRoYXQgd2Ugc3VwcG9ydCBpbiBzY2hlbWF0aWNzIGl0c2VsZi5cbiAgICovXG4gIGNvbnN0IHBhcnNlZEFyZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBhcmd2KTtcbiAgZGVsZXRlIHBhcnNlZEFyZ3NbJy0tJ107XG4gIGZvciAoY29uc3Qga2V5IG9mIGJvb2xlYW5BcmdzKSB7XG4gICAgZGVsZXRlIHBhcnNlZEFyZ3Nba2V5XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3B0aW9ucyBmcm9tIGAtLWAgdG8gYXJncy5cbiAgICovXG4gIGNvbnN0IGFyZ3YyID0gbWluaW1pc3QoYXJndlsnLS0nXSk7XG4gIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGFyZ3YyKSkge1xuICAgIHBhcnNlZEFyZ3Nba2V5XSA9IGFyZ3YyW2tleV07XG4gIH1cblxuICAvLyBQYXNzIHRoZSByZXN0IG9mIHRoZSBhcmd1bWVudHMgYXMgdGhlIHNtYXJ0IGRlZmF1bHQgXCJhcmd2XCIuIFRoZW4gZGVsZXRlIGl0LlxuICB3b3JrZmxvdy5yZWdpc3RyeS5hZGRTbWFydERlZmF1bHRQcm92aWRlcignYXJndicsIChzY2hlbWE6IEpzb25PYmplY3QpID0+IHtcbiAgICBpZiAoJ2luZGV4JyBpbiBzY2hlbWEpIHtcbiAgICAgIHJldHVybiBhcmd2Ll9bTnVtYmVyKHNjaGVtYVsnaW5kZXgnXSldO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYXJndi5fO1xuICAgIH1cbiAgfSk7XG4gIGRlbGV0ZSBwYXJzZWRBcmdzLl87XG5cbiAgLy8gQWRkIHByb21wdHMuXG4gIHdvcmtmbG93LnJlZ2lzdHJ5LnVzZVByb21wdFByb3ZpZGVyKF9jcmVhdGVQcm9tcHRQcm92aWRlcigpKTtcblxuXG4gIC8qKlxuICAgKiAgRXhlY3V0ZSB0aGUgd29ya2Zsb3csIHdoaWNoIHdpbGwgcmVwb3J0IHRoZSBkcnkgcnVuIGV2ZW50cywgcnVuIHRoZSB0YXNrcywgYW5kIGNvbXBsZXRlXG4gICAqICBhZnRlciBhbGwgaXMgZG9uZS5cbiAgICpcbiAgICogIFRoZSBPYnNlcnZhYmxlIHJldHVybmVkIHdpbGwgcHJvcGVybHkgY2FuY2VsIHRoZSB3b3JrZmxvdyBpZiB1bnN1YnNjcmliZWQsIGVycm9yIG91dCBpZiBBTllcbiAgICogIHN0ZXAgb2YgdGhlIHdvcmtmbG93IGZhaWxlZCAoc2luayBvciB0YXNrKSwgd2l0aCBkZXRhaWxzIGluY2x1ZGVkLCBhbmQgd2lsbCBvbmx5IGNvbXBsZXRlXG4gICAqICB3aGVuIGV2ZXJ5dGhpbmcgaXMgZG9uZS5cbiAgICovXG4gIHRyeSB7XG4gICAgYXdhaXQgd29ya2Zsb3cuZXhlY3V0ZSh7XG4gICAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uTmFtZSxcbiAgICAgIHNjaGVtYXRpYzogc2NoZW1hdGljTmFtZSxcbiAgICAgIG9wdGlvbnM6IHBhcnNlZEFyZ3MsXG4gICAgICBhbGxvd1ByaXZhdGU6IGFsbG93UHJpdmF0ZSxcbiAgICAgIGRlYnVnOiBkZWJ1ZyxcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgIH0pXG4gICAgICAudG9Qcm9taXNlKCk7XG5cbiAgICBpZiAobm90aGluZ0RvbmUpIHtcbiAgICAgIGxvZ2dlci5pbmZvKCdOb3RoaW5nIHRvIGJlIGRvbmUuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG5cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgaWYgKGVyciBpbnN0YW5jZW9mIFVuc3VjY2Vzc2Z1bFdvcmtmbG93RXhlY3V0aW9uKSB7XG4gICAgICAvLyBcIlNlZSBhYm92ZVwiIGJlY2F1c2Ugd2UgYWxyZWFkeSBwcmludGVkIHRoZSBlcnJvci5cbiAgICAgIGxvZ2dlci5mYXRhbCgnVGhlIFNjaGVtYXRpYyB3b3JrZmxvdyBmYWlsZWQuIFNlZSBhYm92ZS4nKTtcbiAgICB9IGVsc2UgaWYgKGRlYnVnKSB7XG4gICAgICBsb2dnZXIuZmF0YWwoJ0FuIGVycm9yIG9jY3VyZWQ6XFxuJyArIGVyci5zdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ2dlci5mYXRhbChlcnIuc3RhY2sgfHwgZXJyLm1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiAxO1xuICB9XG59XG5cbiAvKipcbiAqIEdldCB1c2FnZSBvZiB0aGUgQ0xJIHRvb2wuXG4gKi9cbmZ1bmN0aW9uIGdldFVzYWdlKCk6IHN0cmluZyB7XG4gIHJldHVybiB0YWdzLnN0cmlwSW5kZW50YFxuICBzY2hlbWF0aWNzIFtDb2xsZWN0aW9uTmFtZTpdU2NoZW1hdGljTmFtZSBbb3B0aW9ucywgLi4uXVxuXG4gIEJ5IGRlZmF1bHQsIGlmIHRoZSBjb2xsZWN0aW9uIG5hbWUgaXMgbm90IHNwZWNpZmllZCwgdXNlIHRoZSBpbnRlcm5hbCBjb2xsZWN0aW9uIHByb3ZpZGVkXG4gIGJ5IHRoZSBTY2hlbWF0aWNzIENMSS5cblxuICBPcHRpb25zOlxuICAgICAgLS1kZWJ1ZyAgICAgICAgICAgICBEZWJ1ZyBtb2RlLiBUaGlzIGlzIHRydWUgYnkgZGVmYXVsdCBpZiB0aGUgY29sbGVjdGlvbiBpcyBhIHJlbGF0aXZlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggKGluIHRoYXQgY2FzZSwgdHVybiBvZmYgd2l0aCAtLWRlYnVnPWZhbHNlKS5cblxuICAgICAgLS1hbGxvdy1wcml2YXRlICAgICBBbGxvdyBwcml2YXRlIHNjaGVtYXRpY3MgdG8gYmUgcnVuIGZyb20gdGhlIGNvbW1hbmQgbGluZS4gRGVmYXVsdCB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZS5cblxuICAgICAgLS1kcnktcnVuICAgICAgICAgICBEbyBub3Qgb3V0cHV0IGFueXRoaW5nLCBidXQgaW5zdGVhZCBqdXN0IHNob3cgd2hhdCBhY3Rpb25zIHdvdWxkIGJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmZvcm1lZC4gRGVmYXVsdCB0byB0cnVlIGlmIGRlYnVnIGlzIGFsc28gdHJ1ZS5cblxuICAgICAgLS1mb3JjZSAgICAgICAgICAgICBGb3JjZSBvdmVyd3JpdGluZyBmaWxlcyB0aGF0IHdvdWxkIG90aGVyd2lzZSBiZSBhbiBlcnJvci5cblxuICAgICAgLS1saXN0LXNjaGVtYXRpY3MgICBMaXN0IGFsbCBzY2hlbWF0aWNzIGZyb20gdGhlIGNvbGxlY3Rpb24sIGJ5IG5hbWUuIEEgY29sbGVjdGlvbiBuYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZCBiZSBzdWZmaXhlZCBieSBhIGNvbG9uLiBFeGFtcGxlOiAnQHNjaGVtYXRpY3Mvc2NoZW1hdGljczonLlxuXG4gICAgICAtLXZlcmJvc2UgICAgICAgICAgIFNob3cgbW9yZSBpbmZvcm1hdGlvbi5cblxuICAgICAgLS1oZWxwICAgICAgICAgICAgICBTaG93IHRoaXMgbWVzc2FnZS5cblxuICBBbnkgYWRkaXRpb25hbCBvcHRpb24gaXMgcGFzc2VkIHRvIHRoZSBTY2hlbWF0aWNzIGRlcGVuZGluZyBvblxuICBgO1xufVxuXG4vKiogUGFyc2UgdGhlIGNvbW1hbmQgbGluZS4gKi9cbmNvbnN0IGJvb2xlYW5BcmdzID0gW1xuICAnYWxsb3dQcml2YXRlJyxcbiAgJ2FsbG93LXByaXZhdGUnLFxuICAnZGVidWcnLFxuICAnZHJ5LXJ1bicsXG4gICdkcnlSdW4nLFxuICAnZm9yY2UnLFxuICAnaGVscCcsXG4gICdsaXN0LXNjaGVtYXRpY3MnLFxuICAnbGlzdFNjaGVtYXRpY3MnLFxuICAndmVyYm9zZScsXG5dO1xuXG5mdW5jdGlvbiBwYXJzZUFyZ3MoYXJnczogc3RyaW5nW10gfCB1bmRlZmluZWQpOiBtaW5pbWlzdC5QYXJzZWRBcmdzIHtcbiAgICByZXR1cm4gbWluaW1pc3QoYXJncywge1xuICAgICAgYm9vbGVhbjogYm9vbGVhbkFyZ3MsXG4gICAgICBhbGlhczoge1xuICAgICAgICAnZHJ5UnVuJzogJ2RyeS1ydW4nLFxuICAgICAgICAnbGlzdFNjaGVtYXRpY3MnOiAnbGlzdC1zY2hlbWF0aWNzJyxcbiAgICAgICAgJ2FsbG93UHJpdmF0ZSc6ICdhbGxvdy1wcml2YXRlJyxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgICdkZWJ1Zyc6IG51bGwsXG4gICAgICAgICdkcnlSdW4nOiBudWxsLFxuICAgICAgfSxcbiAgICAgICctLSc6IHRydWUsXG4gICAgfSk7XG59XG5cbmlmIChyZXF1aXJlLm1haW4gPT09IG1vZHVsZSkge1xuICBjb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuICBtYWluKHsgYXJncyB9KVxuICAgIC50aGVuKGV4aXRDb2RlID0+IHByb2Nlc3MuZXhpdENvZGUgPSBleGl0Q29kZSlcbiAgICAuY2F0Y2goZSA9PiB7IHRocm93IChlKTsgfSk7XG59XG4iXX0=