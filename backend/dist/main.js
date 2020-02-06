/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
const bodyParser = __webpack_require__(43);
const logger_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const exception_filter_1 = __webpack_require__(44);
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, {
            logger: new logger_1.CustomLogger(),
        });
        app.use(bodyParser.json());
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.useGlobalFilters(new exception_filter_1.AllExceptionsFilter());
        const options = new swagger_1.DocumentBuilder()
            .setTitle("Diamonds")
            .setDescription("Diamonds API description")
            .setVersion("2.0")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup("docs", app, document);
        yield app.listen(process.env.PORT || 5000);
    });
}
bootstrap();


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const id_service_1 = __webpack_require__(5);
const validator_service_1 = __webpack_require__(6);
const bots_service_1 = __webpack_require__(7);
const highscores_controller_1 = __webpack_require__(10);
const boards_controller_1 = __webpack_require__(12);
const bots_controller_1 = __webpack_require__(40);
const logger_1 = __webpack_require__(17);
const board_service_1 = __webpack_require__(16);
const high_scores_service_1 = __webpack_require__(11);
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        controllers: [bots_controller_1.BotsController, boards_controller_1.BoardsController, highscores_controller_1.HighscoresController],
        imports: [],
        providers: [
            logger_1.CustomLogger,
            board_service_1.BoardsService,
            bots_service_1.BotsService,
            id_service_1.IdService,
            validator_service_1.ValidatorService,
            high_scores_service_1.HighScoresService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
let IdService = class IdService {
    constructor() {
        this.counter = 1;
    }
    next() {
        return `${this.counter++}`;
    }
};
IdService = __decorate([
    common_1.Injectable()
], IdService);
exports.IdService = IdService;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
let ValidatorService = class ValidatorService {
    isValidEmail(input) {
        return input.includes("@");
    }
    isValidName(input) {
        return input.length > 0;
    }
};
ValidatorService = __decorate([
    common_1.Injectable()
], ValidatorService);
exports.ValidatorService = ValidatorService;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const id_service_1 = __webpack_require__(5);
const conflict_error_1 = __webpack_require__(8);
let BotsService = class BotsService {
    constructor(idService) {
        this.idService = idService;
        this.bots = [];
        this.bots.push({
            id: idService.next(),
            token: idService.next(),
            name: "test",
            email: "test@test.se",
        });
        this.bots.push({
            id: idService.next(),
            token: idService.next(),
            name: "test2",
            email: "test2@test.se",
        });
        console.log(this.bots);
    }
    add(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.emailExists(input.email) || this.nameExists(input.name)) {
                throw new conflict_error_1.default("Email and/or name already exists");
            }
            const bot = {
                token: this.idService.next().toString(),
                name: input.name,
                email: input.email,
                id: this.idService.next().toString(),
            };
            this.bots.push(bot);
            return Promise.resolve(bot);
        });
    }
    get(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bots.find(b => b.token === token);
        });
    }
    all() {
        return [...this.bots];
    }
    emailExists(email) {
        email = email.toLowerCase();
        return this.bots.some((bot) => bot.email.toLowerCase() === email);
    }
    nameExists(name) {
        name = name.toLowerCase();
        return this.bots.some((bot) => bot.name.toLowerCase() === name);
    }
};
BotsService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [id_service_1.IdService])
], BotsService);
exports.BotsService = BotsService;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_error_1 = __webpack_require__(9);
class ConflictError extends base_error_1.default {
    constructor(message) {
        super(message);
    }
}
exports.default = ConflictError;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DiamondsBaseError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.default = DiamondsBaseError;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(2);
const high_scores_service_1 = __webpack_require__(11);
let HighscoresController = class HighscoresController {
    constructor(highScoresService) {
        this.highScoresService = highScoresService;
    }
    listAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.highScoresService.all();
        });
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HighscoresController.prototype, "listAll", null);
HighscoresController = __decorate([
    swagger_1.ApiUseTags("Highscores"),
    common_1.Controller("api/highscores"),
    __metadata("design:paramtypes", [high_scores_service_1.HighScoresService])
], HighscoresController);
exports.HighscoresController = HighscoresController;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const id_service_1 = __webpack_require__(5);
let HighScoresService = class HighScoresService {
    constructor(idService) {
        this.idService = idService;
        this.highScores = [];
        let testHighScore = {
            botName: "test",
            score: 22,
        };
        this.highScores.push(testHighScore);
    }
    addOrUpdate(input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isNewHighScore(input)) {
                this.highScores.push(input);
            }
            return Promise.resolve(true);
        });
    }
    isNewHighScore(newScore) {
        let isHighScore = true;
        this.highScores.forEach((highScore, index) => {
            if (newScore.botName == highScore.botName) {
                if (newScore.score > highScore.score) {
                    this.updateHighScore(index, newScore);
                }
                isHighScore = false;
                return false;
            }
        });
        return isHighScore;
    }
    updateHighScore(index, newScore) {
        this.highScores[index] = newScore;
    }
    all() {
        return this.highScores;
    }
};
HighScoresService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [id_service_1.IdService])
], HighScoresService);
exports.HighScoresService = HighScoresService;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(2);
const board_dto_1 = __webpack_require__(13);
const board_service_1 = __webpack_require__(16);
const join_input_dto_1 = __webpack_require__(37);
const move_input_dto_1 = __webpack_require__(38);
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    findAll() {
        return this.boardsService.getAll();
    }
    find(id) {
        return this.boardsService.getById(id);
    }
    join(id, input) {
        return this.boardsService.join(id, input.botToken);
    }
    move(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.boardsService.move(id, input.botToken, input.direction);
        });
    }
};
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        isArray: true,
        description: "Return boards",
        type: board_dto_1.BoardDto,
    }),
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], BoardsController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        description: "Returns specific board",
        type: board_dto_1.BoardDto,
    }),
    swagger_1.ApiResponse({
        status: 404,
        description: "Board not found",
    }),
    common_1.Get(":id"),
    __param(0, common_1.Param("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", board_dto_1.BoardDto)
], BoardsController.prototype, "find", null);
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        description: "Joined specific board",
    }),
    swagger_1.ApiResponse({
        status: 404,
        description: "Board not found",
    }),
    swagger_1.ApiResponse({
        status: 409,
        description: "Board full",
    }),
    common_1.HttpCode(200),
    common_1.Post(":id/join"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, join_input_dto_1.JoinInputDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "join", null);
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        description: "Returns specific board",
        type: board_dto_1.BoardDto,
    }),
    swagger_1.ApiResponse({
        status: 403,
        description: "Move not legal",
    }),
    swagger_1.ApiResponse({
        status: 404,
        description: "Board not found",
    }),
    common_1.HttpCode(200),
    common_1.Post(":id/move"),
    __param(0, common_1.Param("id")), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, move_input_dto_1.MoveInputDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "move", null);
BoardsController = __decorate([
    swagger_1.ApiUseTags("Boards"),
    common_1.Controller("api/boards"),
    __metadata("design:paramtypes", [board_service_1.BoardsService])
], BoardsController);
exports.BoardsController = BoardsController;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const game_object_dto_1 = __webpack_require__(14);
const swagger_1 = __webpack_require__(2);
class BoardDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], BoardDto.prototype, "id", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BoardDto.prototype, "width", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BoardDto.prototype, "height", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BoardDto.prototype, "minimumDelayBetweenMoves", void 0);
__decorate([
    swagger_1.ApiModelProperty({ isArray: true, type: game_object_dto_1.GameObjectDto }),
    __metadata("design:type", Array)
], BoardDto.prototype, "gameObjects", void 0);
exports.BoardDto = BoardDto;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
const position_dto_1 = __webpack_require__(15);
class GameObjectDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], GameObjectDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", position_dto_1.PositionDto)
], GameObjectDto.prototype, "position", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Object)
], GameObjectDto.prototype, "properties", void 0);
exports.GameObjectDto = GameObjectDto;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
class PositionDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], PositionDto.prototype, "x", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], PositionDto.prototype, "y", void 0);
exports.PositionDto = PositionDto;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const logger_1 = __webpack_require__(17);
const diamond_button_provider_1 = __webpack_require__(21);
const base_provider_1 = __webpack_require__(27);
const diamond_provider_1 = __webpack_require__(29);
const bot_provider_1 = __webpack_require__(30);
const not_found_error_1 = __webpack_require__(31);
const bots_service_1 = __webpack_require__(7);
const unauthorized_error_1 = __webpack_require__(32);
const move_direction_enum_1 = __webpack_require__(33);
const operation_queue_board_1 = __webpack_require__(34);
const high_scores_service_1 = __webpack_require__(11);
let BoardsService = class BoardsService {
    constructor(botsService, highscoresService, logger) {
        this.botsService = botsService;
        this.highscoresService = highscoresService;
        this.logger = logger;
        this.boards = [];
        this.createInMemoryBoard();
        this.boards.forEach(board => {
            board.registerSessionFinishedCallback((botName, score) => {
                console.log("HIGHSCORE", botName, score);
                this.highscoresService.addOrUpdate({
                    botName,
                    score,
                });
            });
        });
    }
    getAll() {
        return this.boards.map(b => this.getAsDto(b));
    }
    getById(id) {
        const board = this.getBoardById(id);
        if (board) {
            return this.getAsDto(board);
        }
        throw new not_found_error_1.default("Board not found");
    }
    join(boardId, botToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const bot = yield this.botsService.get(botToken);
            if (!bot) {
                throw new unauthorized_error_1.default("Invalid botToken");
            }
            const board = this.getBoardById(boardId);
            if (!board) {
                throw new not_found_error_1.default("Board not found");
            }
            return board.enqueueJoin(bot);
        });
    }
    move(boardId, botToken, direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const board = this.getBoardById(boardId);
            if (!board) {
                throw new not_found_error_1.default("Board not found");
            }
            const bot = board.getBot(botToken);
            if (!bot) {
                throw new unauthorized_error_1.default("Invalid botToken");
            }
            return board.enqueueMove(bot, this.directionToDelta(direction));
        });
    }
    getBoardById(id) {
        return this.boards.find(b => b.getId() === id);
    }
    directionToDelta(direction) {
        switch (direction) {
            case move_direction_enum_1.MoveDirection.NORTH:
                return { x: 0, y: -1 };
            case move_direction_enum_1.MoveDirection.SOUTH:
                return { x: 0, y: 1 };
            case move_direction_enum_1.MoveDirection.WEST:
                return { x: -1, y: 0 };
            case move_direction_enum_1.MoveDirection.EAST:
                return { x: 1, y: 0 };
            default:
                throw Error();
        }
    }
    getAsDto(board) {
        return {
            id: `${board.getId()}`,
            width: board.width,
            height: board.height,
            minimumDelayBetweenMoves: board.getConfig().minimumDelayBetweenMoves,
            gameObjects: board.getAllGameObjects().map(g => {
                return {
                    id: g.id,
                    position: g.position,
                    type: g.constructor.name,
                    properties: g.properties,
                };
            }),
        };
    }
    createInMemoryBoard() {
        const providers = [
            new diamond_button_provider_1.DiamondButtonProvider(),
            new base_provider_1.BaseProvider(),
            new diamond_provider_1.DiamondProvider({
                generationRatio: 0.1,
                minRatioForGeneration: 0.01,
            }),
            new bot_provider_1.BotProvider({
                inventorySize: 5,
            }),
        ];
        const config = {
            height: 10,
            width: 10,
            minimumDelayBetweenMoves: 100,
            sessionLength: 60,
        };
        const board = new operation_queue_board_1.OperationQueueBoard(config, providers, this.logger);
        this.boards.push(board);
    }
};
BoardsService = __decorate([
    common_1.Injectable({ scope: common_1.Scope.DEFAULT }),
    __metadata("design:paramtypes", [bots_service_1.BotsService,
        high_scores_service_1.HighScoresService,
        logger_1.CustomLogger])
], BoardsService);
exports.BoardsService = BoardsService;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk = __webpack_require__(18);
const log = __webpack_require__(19);
const prefix = __webpack_require__(20);
const colors = {
    TRACE: chalk["magenta"],
    DEBUG: chalk["cyan"],
    INFO: chalk["blue"],
    WARN: chalk["yellow"],
    ERROR: chalk["red"],
};
prefix.reg(log);
log.enableAll();
prefix.apply(log, {
    format(level, name, timestamp) {
        return `${chalk["gray"](`[${timestamp}]`)} ${colors[level](level.toUpperCase().padEnd(8, " "))} `;
    },
    timestampFormatter(date) {
        return date.toISOString();
    },
});
prefix.apply(log.getLogger("critical"), {
    format(level, name, timestamp) {
        return chalk["red"]["bold"](`[${timestamp}] ${level} ${name}:`);
    },
});
exports.default = log;
class CustomLogger {
    log(message) {
        log.debug(message);
    }
    error(message, trace) {
        log.error(message);
    }
    trace(message) {
        log.debug(message);
    }
    warn(message) {
        log.warn(message);
    }
    debug(message) {
        log.debug(message);
    }
    verbose(message) {
        log.debug(message);
    }
}
exports.CustomLogger = CustomLogger;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("loglevel");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("loglevel-plugin-prefix");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_providers_1 = __webpack_require__(22);
const diamond_button_1 = __webpack_require__(23);
class DiamondButtonProvider extends abstract_game_object_providers_1.AbstractGameObjectProvider {
    onGameObjectsRemoved(board, gameObjects) {
        const existingButtons = board.getGameObjectsByType(diamond_button_1.DiamondButtonGameObject);
        if (existingButtons.length == 0) {
            this.generateNewButton(board);
        }
    }
    onBoardInitialized(board) {
        this.generateNewButton(board);
    }
    generateNewButton(board) {
        const position = board.getEmptyPosition();
        const button = new diamond_button_1.DiamondButtonGameObject(position);
        board.addGameObjects([button]);
    }
}
exports.DiamondButtonProvider = DiamondButtonProvider;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AbstractGameObjectProvider {
    onBoardInitialized(board) { }
    onBotJoined(bot, board) { }
    onBotFinished(bot, board) { }
    onGameObjectsRemoved(board, gameObjects) { }
    onGameObjectsAdded(board, gameObjects) { }
}
exports.AbstractGameObjectProvider = AbstractGameObjectProvider;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_1 = __webpack_require__(24);
const diamond_1 = __webpack_require__(25);
const bot_1 = __webpack_require__(26);
class DiamondButtonGameObject extends abstract_game_object_1.AbstractGameObject {
    onGameObjectEntered(gameObject, board) {
        if (gameObject instanceof bot_1.BotGameObject) {
            board.removeGameObjectsByType(DiamondButtonGameObject);
            board.removeGameObjectsByType(diamond_1.DiamondGameObject);
        }
    }
}
exports.DiamondButtonGameObject = DiamondButtonGameObject;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AbstractGameObject {
    constructor(startPosition) {
        this.positions = [];
        this._id = AbstractGameObject.nextId++;
        this.position = startPosition;
    }
    get x() {
        return this.position.x;
    }
    get y() {
        return this.position.y;
    }
    get id() {
        return this._id;
    }
    get position() {
        return Object.assign({}, this.positions[this.positions.length - 1]);
    }
    set position(newPosition) {
        this.positions.push(newPosition);
    }
    get previousPosition() {
        return this.positions.length > 1 ? Object.assign({}, this.positions[this.positions.length - 2]) : null;
    }
    get properties() {
        return null;
    }
    hasAlreadyBeenHere(position) {
        return this.positions.some(p => position.x === p.x &&
            position.y === p.y);
    }
    clearPositions() {
        this.positions = [this.position];
    }
    canGameObjectEnter(gameObject, board) {
        return true;
    }
    onGameObjectEntered(gameObject, board) { }
    canGameObjectLeave(gameObject, board) {
        return true;
    }
    onGameObjectLeft(gameObject, board) { }
    onGameObjectCallbackNotified(board, intervalMs) { }
    onGameObjectRemoved(board) { }
    onEvent(board, sender, message, payload) { }
    toLogString() {
        return `${this.constructor.name}(${this.position.x},${this.position.y})`;
    }
}
exports.AbstractGameObject = AbstractGameObject;
AbstractGameObject.nextId = 1;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_1 = __webpack_require__(24);
const bot_1 = __webpack_require__(26);
class DiamondGameObject extends abstract_game_object_1.AbstractGameObject {
    constructor(position, points) {
        super(position);
        this.points = points;
    }
    onGameObjectEntered(gameObject, board) {
        if (gameObject instanceof bot_1.BotGameObject) {
            const bot = gameObject;
            if (bot.diamonds + this.points <= bot.inventorySize) {
                bot.diamonds += this.points;
                board.removeGameObject(this);
            }
        }
    }
}
exports.DiamondGameObject = DiamondGameObject;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_1 = __webpack_require__(24);
class BotGameObject extends abstract_game_object_1.AbstractGameObject {
    get properties() {
        return {
            diamonds: this.diamonds,
            score: this.score,
            nextMoveAvailableAt: this.nextMoveAvailableAt,
            name: this.name,
            inventorySize: this.inventorySize,
            millisecondsLeft: this.expiresAt.getTime() - new Date().getTime(),
            timeJoined: this.timeJoined,
            base: this.base,
        };
    }
}
exports.BotGameObject = BotGameObject;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_providers_1 = __webpack_require__(22);
const bot_1 = __webpack_require__(26);
const base_1 = __webpack_require__(28);
class BaseProvider extends abstract_game_object_providers_1.AbstractGameObjectProvider {
    onGameObjectsAdded(board, gameObjects) {
        gameObjects
            .filter(g => g instanceof bot_1.BotGameObject)
            .forEach((bot) => {
            if (!bot.base) {
                bot.base = board.getEmptyPosition();
            }
            board.addGameObjects([new base_1.BaseGameObject(bot.base)]);
        });
    }
    onGameObjectsRemoved(board, gameObjects) {
        gameObjects
            .filter(g => g instanceof bot_1.BotGameObject)
            .forEach((bot) => {
            const base = board
                .getGameObjectsByType(base_1.BaseGameObject)
                .find(base => base.position.x === bot.base.x && base.position.y === bot.base.y);
            if (base) {
                bot.base = null;
                board.removeGameObject(base);
            }
        });
    }
}
exports.BaseProvider = BaseProvider;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_1 = __webpack_require__(24);
const bot_1 = __webpack_require__(26);
class BaseGameObject extends abstract_game_object_1.AbstractGameObject {
    onGameObjectEntered(gameObject, board) {
        if (gameObject instanceof bot_1.BotGameObject) {
            const bot = gameObject;
            bot.score += bot.diamonds;
            bot.diamonds = 0;
        }
    }
}
exports.BaseGameObject = BaseGameObject;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_providers_1 = __webpack_require__(22);
const diamond_1 = __webpack_require__(25);
class DiamondProvider extends abstract_game_object_providers_1.AbstractGameObjectProvider {
    constructor(config) {
        super();
        this.config = config;
    }
    onBoardInitialized(board) {
        this.generateDiamonds(board);
    }
    onGameObjectsRemoved(board, other) {
        const diamonds = board.getGameObjectsByType(diamond_1.DiamondGameObject);
        const minLimit = board.width * board.height * this.config.minRatioForGeneration;
        if (diamonds.length == 0) {
            this.generateDiamonds(board);
        }
    }
    generateDiamonds(board) {
        const count = board.width * board.height * this.config.generationRatio;
        const diamonds = new Array(count)
            .fill(null)
            .map(_ => new diamond_1.DiamondGameObject(board.getEmptyPosition(), 1));
        board.addGameObjects(diamonds);
    }
}
exports.DiamondProvider = DiamondProvider;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const abstract_game_object_providers_1 = __webpack_require__(22);
const bot_1 = __webpack_require__(26);
class BotProvider extends abstract_game_object_providers_1.AbstractGameObjectProvider {
    constructor(config) {
        super();
        this.config = config;
    }
    onBotJoined(bot, board) {
        const base = board.getEmptyPosition();
        const botGameObject = this.getInitializedBot(bot, base, board);
        board.addGameObjects([botGameObject]);
    }
    getInitializedBot(data, base, board) {
        console.log("Hello");
        const botGameObject = new bot_1.BotGameObject(base);
        botGameObject.base = { x: base.x, y: base.y };
        botGameObject.timeJoined = new Date();
        botGameObject.expiresAt = new Date(botGameObject.timeJoined.getTime() +
            board.getConfig().sessionLength * 1000);
        botGameObject.diamonds = 0;
        botGameObject.score = 0;
        botGameObject.inventorySize = this.config.inventorySize;
        botGameObject.name = data.name;
        return botGameObject;
    }
}
exports.BotProvider = BotProvider;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_error_1 = __webpack_require__(9);
class NotFoundError extends base_error_1.default {
    constructor(message) {
        super(message);
    }
}
exports.default = NotFoundError;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const base_error_1 = __webpack_require__(9);
class UnauthorizedError extends base_error_1.default {
    constructor(message) {
        super(message);
    }
}
exports.default = UnauthorizedError;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MoveDirection;
(function (MoveDirection) {
    MoveDirection["NORTH"] = "NORTH";
    MoveDirection["SOUTH"] = "SOUTH";
    MoveDirection["WEST"] = "WEST";
    MoveDirection["EAST"] = "EAST";
})(MoveDirection = exports.MoveDirection || (exports.MoveDirection = {}));


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __webpack_require__(35);
const async = __webpack_require__(36);
class OperationQueueBoard extends board_1.Board {
    constructor(config, gameObjectProviders, logger) {
        super(config, gameObjectProviders, logger);
        this.config = config;
        this.gameObjectProviders = gameObjectProviders;
        this.logger = logger;
        this.setupOperationQueue();
    }
    setupOperationQueue() {
        const sleep = m => new Promise(r => setTimeout(r, m));
        this.opQueue = async.queue((t, cb) => __awaiter(this, void 0, void 0, function* () {
            const board = t["board"];
            const bot = t["bot"];
            const direction = t["direction"];
            const queuedAt = t["queuedAt"];
            console.log(bot.name, "before sleep");
            yield sleep(3000);
            console.log(bot.name, "after sleep");
            console.log("Current queue time:", new Date().getTime() - queuedAt.getTime(), "ms");
            try {
                const res = t.run();
                cb(res);
            }
            catch (e) {
                cb(null, e);
            }
        }));
    }
    enqueueJoin(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new OperationQueueJoinEvent(bot, this);
            return new Promise((resolve, reject) => {
                this.opQueue.push(event, (res, err) => {
                    console.log(res, err);
                    if (err) {
                        resolve(false);
                    }
                    else {
                        console.log(bot.name, "join done", res);
                        resolve(res);
                    }
                });
            });
        });
    }
    enqueueMove(bot, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new OperationQueueMoveEvent(bot, this, delta);
            return new Promise((resolve, reject) => {
                this.opQueue.push(event, (res, err) => {
                    console.log(res, err);
                    if (err) {
                        resolve(false);
                    }
                    else {
                        console.log(bot.name, "move done", res);
                        resolve(res);
                    }
                });
            });
        });
    }
}
exports.OperationQueueBoard = OperationQueueBoard;
class OperationQueueEvent {
    constructor(bot, board) {
        this.bot = bot;
        this.board = board;
        this.queuedAt = new Date();
    }
    run() {
        throw Error("Not implemented");
    }
}
exports.OperationQueueEvent = OperationQueueEvent;
class OperationQueueMoveEvent extends OperationQueueEvent {
    constructor(bot, board, delta) {
        super(bot, board);
        this.bot = bot;
        this.board = board;
        this.delta = delta;
    }
    run() {
        return this.board.move(this.bot, this.delta);
    }
}
exports.OperationQueueMoveEvent = OperationQueueMoveEvent;
class OperationQueueJoinEvent extends OperationQueueEvent {
    run() {
        return this.board.join(this.bot);
    }
}
exports.OperationQueueJoinEvent = OperationQueueJoinEvent;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __webpack_require__(26);
const not_found_error_1 = __webpack_require__(31);
class Board {
    constructor(config, gameObjectProviders, logger) {
        this.config = config;
        this.gameObjectProviders = gameObjectProviders;
        this.logger = logger;
        this._id = `${Board.nextId++}`;
        this.bots = {};
        this.gameObjects = [];
        this.maxNumberOfCarryingDiamonds = 5;
        this.callbackLoopsRegistered = {};
        this.callbackLoopsId = {};
        this.notifyProvidersBoardInitialized();
    }
    getId() {
        return this._id;
    }
    registerSessionFinishedCallback(callback) {
        this.highscoreCallback = callback;
    }
    join(bot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.bots[bot.token] = bot;
            this.createNewExpirationTimer(bot);
            this.notifyProvidersBoardBotJoined(bot);
            return true;
        });
    }
    getBot(token) {
        return this.bots[token];
    }
    move(bot, delta) {
        return __awaiter(this, void 0, void 0, function* () {
            const botGameObject = this.getGameObjectsByType(bot_1.BotGameObject).find(b => b.name === bot.name);
            if (!botGameObject) {
                throw new not_found_error_1.default("Bot not on the board");
            }
            const position = botGameObject.position;
            position.x = position.x + delta.x;
            position.y = position.y + delta.y;
            return this.trySetGameObjectPosition(botGameObject, position);
        });
    }
    createNewExpirationTimer(bot) {
        const id = setTimeout(_ => {
            this.logger.debug(`Purge bot ${bot.name}`);
            const botGameObject = this.getGameObjectsByType(bot_1.BotGameObject).find(b => b.name === bot.name);
            this.removeGameObject(botGameObject);
            if (this.highscoreCallback) {
                this.highscoreCallback(botGameObject.name, botGameObject.score);
            }
        }, this.config.sessionLength * 1000);
        return id;
    }
    isCellEmpty(x, y) {
        return !this.gameObjects.some(g => g.x === x && g.y === y);
    }
    registerGameObjectForCallbackLoop(gameObject, interval) {
        if (!(interval in this.callbackLoopsRegistered)) {
            const id = setInterval(_ => {
                this.logger.debug(`Callback loop triggered for interval ${interval}`);
                this.callbackLoopsRegistered[interval].forEach((g) => g.onGameObjectCallbackNotified(this, interval));
            }, interval);
            this.callbackLoopsRegistered[interval] = [gameObject];
            this.callbackLoopsId[interval] = id;
        }
        else {
            this.callbackLoopsRegistered[interval].push(gameObject);
        }
    }
    unregisterGameObjectFromCallbackLoop(gameObject, interval) {
        if (interval in this.callbackLoopsRegistered) {
            this.callbackLoopsRegistered[interval] = this.callbackLoopsRegistered[interval].filter(g => g != gameObject);
            if (this.callbackLoopsRegistered[interval].length === 0) {
            }
        }
    }
    getEmptyPosition() {
        for (var i = 0; i < this.config.width * this.config.height; i++) {
            const { x, y } = this.getRandomPosition();
            if (this.isCellEmpty(x, y)) {
                return { x, y };
            }
        }
        for (var i = 0; i < this.config.width * this.config.height; i++) {
            const x = i % this.config.width;
            const y = Math.floor(i / this.config.height);
            if (this.isCellEmpty(x, y)) {
                return { x, y };
            }
        }
        return null;
    }
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.config.width),
            y: Math.floor(Math.random() * this.config.height),
        };
    }
    getConfig() {
        return this.config;
    }
    get width() {
        return this.config.width;
    }
    get height() {
        return this.config.height;
    }
    getAllGameObjects() {
        return this.gameObjects;
    }
    getAllGameObjectProviders() {
        return this.gameObjectProviders;
    }
    addGameObjects(gameObjects) {
        this.gameObjects.push(...gameObjects);
        this.notifyProvidersGameObjectsAdded(gameObjects);
    }
    getGameObjectOnPosition(p) {
        return this.gameObjects.filter(g => g.x === p.x && g.y === p.y);
    }
    trySetGameObjectPosition(gameObject, dest, skipLeaveCheck = false, skipEnterCheck = false) {
        if (gameObject.hasAlreadyBeenHere(dest)) {
            this.gameObjects.forEach(o => o.clearPositions());
            return false;
        }
        if (!(skipLeaveCheck || this.canGameObjectLeave(gameObject, dest))) {
            this.logger.debug("Not allowed to leave");
            return false;
        }
        if (this.destinationIsOutOfBounds(dest) ||
            !(skipEnterCheck || this.canGameObjectEnter(gameObject, dest))) {
            this.logger.debug("Not allowed to enter");
            return false;
        }
        const gameObjectsPrev = this.getGameObjectOnPosition(gameObject.position);
        this.logger.debug(JSON.stringify(gameObject), "left", JSON.stringify(gameObject.position));
        gameObjectsPrev.forEach(g => g.onGameObjectLeft(gameObject, this));
        gameObject.position = dest;
        const gameObjectsDest = this.getGameObjectOnPosition(dest);
        this.logger.debug(JSON.stringify(gameObject), "entered", JSON.stringify(gameObject.position));
        gameObjectsDest.forEach(g => g.onGameObjectEntered(gameObject, this));
        return true;
    }
    canGameObjectEnter(gameObject, dest) {
        const gameObjects = this.getGameObjectOnPosition(dest);
        return !gameObjects.some(g => !g.canGameObjectEnter(gameObject, this));
    }
    canGameObjectLeave(gameObject, dest) {
        const gameObjects = this.getGameObjectOnPosition(dest);
        return !gameObjects.some(g => !g.canGameObjectLeave(gameObject, this));
    }
    getGameObjectsByType(t) {
        return this.gameObjects.filter(g => g instanceof t).map(g => g);
    }
    removeGameObject(gameObject) {
        gameObject.onGameObjectRemoved(this);
        this.gameObjects = this.gameObjects.filter(g => g !== gameObject);
        this.notifyProvidersGameObjectsRemoved([gameObject]);
    }
    removeGameObjectsByType(t) {
        this.gameObjects.forEach(g => g.onGameObjectRemoved(this));
        const removed = this.gameObjects.filter(g => !(g instanceof t));
        this.gameObjects = this.gameObjects.filter(g => g instanceof t);
        this.notifyProvidersGameObjectsRemoved(removed);
    }
    notifyProvidersGameObjectsRemoved(gameObjects) {
        this.logger.debug(`notifyProvidersGameObjectsRemoved ${this.getLogString(gameObjects)}`);
        this.gameObjectProviders.forEach(p => p.onGameObjectsRemoved(this, gameObjects));
    }
    getLogString(gameObjects) {
        return JSON.stringify(gameObjects.map(g => g.toLogString()));
    }
    notifyProvidersGameObjectsAdded(gameObjects) {
        this.logger.debug(`notifyProvidersGameObjectsAdded ${this.getLogString(gameObjects)}`);
        this.gameObjectProviders.forEach(p => p.onGameObjectsAdded(this, gameObjects));
    }
    notifyProvidersBoardInitialized() {
        this.logger.debug("notifyProvidersBoardInitialized");
        this.gameObjectProviders.forEach(p => p.onBoardInitialized(this));
    }
    notifyProvidersBoardBotJoined(bot) {
        this.gameObjectProviders.forEach(p => p.onBotJoined(bot, this));
    }
    destinationIsOutOfBounds(destination) {
        const outOfX = destination.x < 0 || destination.x > this.width;
        const outOfY = destination.y < 0 || destination.y > this.height;
        return outOfX || outOfY;
    }
    notifyGameObjectEvent(sender, message, payload) {
        this.logger.debug("notifyGameObjectEvent", JSON.stringify(sender), message, JSON.stringify(payload));
        this.gameObjects.forEach(g => g.onEvent(this, sender, message, payload));
    }
}
exports.Board = Board;
Board.nextId = 1;


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
class JoinInputDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], JoinInputDto.prototype, "botToken", void 0);
exports.JoinInputDto = JoinInputDto;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
const move_direction_enum_1 = __webpack_require__(33);
const class_validator_1 = __webpack_require__(39);
class MoveInputDto {
}
__decorate([
    swagger_1.ApiModelProperty({
        description: "The secret token of the bot that you want to move.",
    }),
    __metadata("design:type", String)
], MoveInputDto.prototype, "botToken", void 0);
__decorate([
    swagger_1.ApiModelProperty({
        description: "The direction you want to move your bot in.",
        enum: move_direction_enum_1.MoveDirection,
    }),
    class_validator_1.IsEnum(move_direction_enum_1.MoveDirection),
    __metadata("design:type", String)
], MoveInputDto.prototype, "direction", void 0);
exports.MoveInputDto = MoveInputDto;


/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("class-validator");

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(2);
const bot_dto_1 = __webpack_require__(41);
const bot_registration_dto_1 = __webpack_require__(42);
const bots_service_1 = __webpack_require__(7);
let BotsController = class BotsController {
    constructor(botService) {
        this.botService = botService;
    }
    create(botRegistration) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.botService.add(botRegistration);
        });
    }
    findAll(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.botService.get(token);
        });
    }
};
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        description: "The bot is successfully created.",
    }),
    swagger_1.ApiResponse({
        status: 409,
        description: "The bot already exists.",
    }),
    common_1.HttpCode(200),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bot_registration_dto_1.BotRegistrationDto]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "create", null);
__decorate([
    swagger_1.ApiResponse({
        status: 200,
        description: "Returns bot",
        type: bot_dto_1.BotDto,
    }),
    swagger_1.ApiResponse({
        status: 404,
        description: "Bot not found",
    }),
    common_1.Get(":token"),
    __param(0, common_1.Param("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BotsController.prototype, "findAll", null);
BotsController = __decorate([
    swagger_1.ApiUseTags("Bots"),
    common_1.Controller("api/bots"),
    __metadata("design:paramtypes", [bots_service_1.BotsService])
], BotsController);
exports.BotsController = BotsController;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
const position_dto_1 = __webpack_require__(15);
class BotDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], BotDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", position_dto_1.PositionDto)
], BotDto.prototype, "base", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", position_dto_1.PositionDto)
], BotDto.prototype, "position", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BotDto.prototype, "diamonds", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Date)
], BotDto.prototype, "timeJoined", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BotDto.prototype, "millisecondsLeft", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Number)
], BotDto.prototype, "score", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], BotDto.prototype, "botId", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Date)
], BotDto.prototype, "nextMoveAvailableAt", void 0);
exports.BotDto = BotDto;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__(2);
const class_validator_1 = __webpack_require__(39);
class BotRegistrationDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], BotRegistrationDto.prototype, "email", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    class_validator_1.IsString(),
    class_validator_1.MinLength(1),
    class_validator_1.MaxLength(10),
    __metadata("design:type", String)
], BotRegistrationDto.prototype, "name", void 0);
exports.BotRegistrationDto = BotRegistrationDto;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__(4);
let AllExceptionsFilter = class AllExceptionsFilter {
    constructor() {
        this.exceptionMap = {
            NotFoundError: common_1.NotFoundException,
            ConflictError: common_1.ConflictException,
            UnauthorizedError: common_1.UnauthorizedException,
        };
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        console.error(exception.stack, exception);
        const httpException = this.mapException(exception);
        const status = httpException.getStatus();
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            data: httpException.message,
        });
    }
    mapException(exception) {
        const output = this.exceptionMap[exception.constructor.name];
        if (output) {
            return new output(exception.message);
        }
        else if (exception instanceof common_1.HttpException) {
            return exception;
        }
        return new common_1.InternalServerErrorException(exception.message);
    }
};
AllExceptionsFilter = __decorate([
    common_1.Catch()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;


/***/ })
/******/ ]);