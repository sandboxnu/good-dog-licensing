# Good Dog Monorepo

This repository is a monorepo for the Good Dog Licensing project, managed with TurboRepo and Bun.

## Table of Contents

- [Good Dog Monorepo](#good-dog-monorepo)
  - [Table of Contents](#table-of-contents)
  - [Structure](#structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running Scripts](#running-scripts)
  - [Running Tests](#running-tests)
  - [Testing in Preview](#testing-in-preview)
  - [X feature isn't working... HELP!! (Troubleshooting, FAQ)](#x-feature-isnt-working-help-troubleshooting-faq)
    - [IMPORTANT: Go through this checklist in order, there is a good chance your issue is resolved by the time you reach the end.](#important-go-through-this-checklist-in-order-there-is-a-good-chance-your-issue-is-resolved-by-the-time-you-reach-the-end)

## Structure

The repository is organized as follows:

- **apps/**: Contains the main applications.
  - **web/**: The web application built with Next.js.
- **packages/**: Contains shared packages. Packages may not have cyclic imports with each other.
  - **auth/**: Authentication-related code.
  - **components/**: Shared React components.
  - **db/**: Database-related scripts and configurations.
  - **email/**: Email-related utilities.
  - **env/**: Environment variable configurations.
  - **trpc/**: tRPC-related code.
- **tests/**: Contains test-related files and configurations.
  - **api/**: API tests.
  - **frontend/**: Frontend tests.
  - **mocks/**: Mock implementations for testing.
- **tooling/**: Contains tooling for the project such configuration as eslint and prettier configs.

## Getting Started

### Prerequisites

Install all these tools before you start:

- [Node.js](https://nodejs.org/) >= 20
- [Bun](https://bun.sh/) >= 1.1.27
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:sandboxnu/good-dog-licensing.git
   cd good-dog-licensing
   ```

2. Install dependencies:

```sh
bun install
```

3. Create env files

```sh
bun env:setup
```

4. Start the dev enviornment:
   You will need to have Docker running to start the database.

```sh
bun dev
```

### Running Scripts

The following scripts are available in the root [package.json](./package.json). There may be some additional scripts not listed here, but this is a mostly up-to-date list, and more importantly, all the essential scripts are listed here.

- `build`: Build all packages and applications.
- `clean`: Clean all `node_modules` and Turbo cache.
- `db:up`: Start the database.
- `db:down`: Stop the database.
- `db:push`: Push database schema changes.
- `db:generate`: Generate database client.
- `db:migrate`: Run database migrations.
- `db:studio`: Open the database Studio.
- `dev`: Start all the development apps.
- `dev:web`: Start only the web app.
- `format`: Check code formatting.
- `format:fix`: Fix code formatting.
- `lint`: Run linting.
- `lint:fix`: Fix linting issues.
- `typecheck`: Run TypeScript type checks.
- `shad:add`: Add a new UI component using Shadcn.
- `generate:package`: Generate a new package.
- `env:setup`: Setup the default env vars
- `test`: Run the test suites

## Running Tests

You can run the entire test suite using `bun test` or run the tests for a specific entrypoint, `bun test <file-path>`. To filter tests by name, use `bun test <file-path> -t <test-name>`. For example, to run all tests for the `frontend` folder, you can run `bun test frontend`.

## Testing in Preview

To test the application in a the environment, follow these steps:

1. Create a PR with the changes you want to test.

2. Push the changes to the branch.

3. Navigate to the PR on GitHub.

4. Look for the "Deploy preview ready" status check.

5. If you have database migrations, click the "Actions" tab on GitHub and look for the "Apply Preview Database Migrations" workflow.

   - You should see a "Run workflow" button. Click it to run the workflow. Make sure to select the correct branch.

   - One the workflow is complete, you can access your preview branch with the database migrations applied

   - Note that we only have one database instance for all preview branches, so if someone else runs the workflow, it may interfere with your preview branch.

## X feature isn't working... HELP!! (Troubleshooting, FAQ)

Aside from the obvious advice of _READING THE ERROR MESSAGES_, if you are still stuck, here are some common things that have come up while working on Good Dog:

### IMPORTANT: Go through this checklist in order, there is a good chance your issue is resolved by the time you reach the end.

1. Is your branch up to date? Make sure to pull/merge/rebase from main.
2. Are your dependencies up to date? Run `bun install` to make sure you have the latest versions of everything.
3. Is your database schema in sync? Run `bun db:push` which
   - Ensures sure your database schema defined in [schema.prisma](./packages/db/prisma/schema.prisma) has been pushed into your local database
   - Generates the typescript types for the database client (you can also manually do just this part with `db:generate`)
4. Are you getting a lot of red or yellow/orange squiggles in your editor? Use command+shift+p to open the command palette and run `Reload developer window` to restart all the language servers.
5. Is something failing in CI or not building correctly?
   - Run `bun typecheck` to see if there are any type errors.
   - Run `bun lint` to see if there are any lint errors.
     - If there are lint errors, run `bun lint:fix` to fix them, or manually correct the errors them.
   - Run `bun format` to see if there are any formatting errors.
     - If there are formatting errors, run `bun format:fix` to fix them, or manually correct the errors them.
