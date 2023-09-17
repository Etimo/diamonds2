# Backend

```bash
yarn  # Install dependencies
npm run env  # Create .env file
npx prisma generate  # Update prisma client
npx prisma db push  # Forcefully create db
npx prisma migrate dev  # Migrate local db
npx prisma migrate reset  # Reset db and run all migrations
npx prisma migrate dev --name <name>  # Create new migration
```

# Database and schema

The full schema of the db is defined in `prisma/schema.schema`.

## Updating schema

If you want to make changes to the schema you do the changes directly in the schema file. After you have made the changes you have two options:

1. Forcefully reset the whole database with the new schema: `npx prisma db push`
2. Create a new migration for the changes in the schema: `npx prisma migrate dev --name <name of migration>`
3. Update our `types` with changed fields and models.
4. Restart backend (live reload doesn't notice this changeg

Option 1 can be used locally when iterating and trying out new changes. When you are happy with the final changes in the schema you must create a migration using option 2. The new migration(s) must then be added to git.

You can create multiple migrations within the same branch but if you are not sure exactly how the new schema should look it is easier to just use option 1 until you are satisfied with the result.

Both of these options will also update the Prisma client in the code `@prisma/client` so that the new types are available in the code.

If the types are not properly reflected in VS Code you can restart the TS server using Ctrl/Cmd+P and choosing TODO.

## Updating seeds

Seeding the database is done in `prisma/seed.ts`. Please make sure that this seed is always up to date and working with the latest schema. You can run `npx prisma db seed` to re-seed the database.

## Run pending migrations

When you pull new changes to the schema you can apply them to your current database using `npx prisma migrate dev`.

## DB GUI

Prisma comes with a built in GUI for browsing the database. Just run `npx prisma studio` to open. You can also use any postgres compatible app on your computer.

## Other commands

```bash
npx prisma migrate reset  # Reset db and run all migrations and seeds again
npx prisma migrate status  # Check if there are any pending migrations not yet applied
npx prisma format  # Format the schema file
```
