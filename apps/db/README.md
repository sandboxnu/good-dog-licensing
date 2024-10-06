# Database Package

This package contains all the database-related stuff for the project. We use the Prisma ORM to manage the database schema and migrations.

## Table of Contents

- [Database Package](#database-package)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Installation](#installation)
  - [Migrations](#migrations)
    - [Creating/Applying Migrations](#creatingapplying-migrations)
    - [Prisma Studio](#prisma-studio)

## Setup

### Installation

1. Generate Prisma binaries and typescript types:

   ```sh
   bun db:generate
   ```

2. Start the database:

   ```sh
   bun db:up
   ```

3. Push changes to the schema to your database

   ```sh
   bun db:push
   ```

## Migrations

### Creating/Applying Migrations

To create a new migration, follow these steps:

1. Make changes to your Prisma schema file located at [`apps/db/prisma/schema.prisma`](./prisma/schema.prisma).

2. Generate a new migration:

   ```sh
   bun db:migrate
   ```

3. Follow the prompts to name your migration.

### Prisma Studio

Prisma Studio is a visual editor for your database. To open Prisma Studio, run:

```sh
bun db:studio
```

This will open a web interface where you can view and edit your database records.
