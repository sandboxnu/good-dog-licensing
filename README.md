# Good Dog Monorepo

test

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
  - [X feature isn't working... HELP!!](#x-feature-isnt-working-help)

## Structure

The repository is organized as follows:

- **apps/**: Contains the main applications.
  - **web/**: The web application built with Next.js.
- **packages/**: Contains shared packages.
  - **auth/**: Authentication-related code.
  - **components/**: Shared React components.
  - **db/**: Database-related scripts and configurations.
  - **email/**: Email-related utilities.
  - **env/**: Environment variable configurations.
  - **trpc/**: tRPC-related code.
  - **ui/**: UI components and utilities.
- **tests/**: Contains test-related files and configurations.
  - **api/**: API tests.
  - **frontend/**: Frontend tests.
  - **mocks/**: Mock implementations for testing.
- **tooling/**: Contains configuration and tooling for the project.
  - **eslint/**: ESLint configurations.
  - **github/**: GitHub Actions and workflows.
  - **prettier/**: Prettier configurations.
  - **tailwind/**: Tailwind CSS configurations.
  - **typescript/**: TypeScript configurations.

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
   cd good-dog
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

```sh
bun dev
```

### Running Scripts

The following scripts are available in the root `package.json`:

- `build`: Build all packages and applications.
- `clean`: Clean all `node_modules` and Turbo cache.
- `db:up`: Start the database.
- `db:down`: Stop the database.
- `db:push`: Push database schema changes.
- `db:generate`: Generate database client.
- `db:migrate`: Run database migrations.
- `db:studio`: Open the database Studio.
- `db:seed` : Seeds the database.
- `dev`: Start all the development apps.
- `dev:web`: Start only the web app.
- `format`: Check code formatting.
- `format:fix`: Fix code formatting.
- `lint`: Run linting.
- `lint:fix`: Fix linting issues.
- `typecheck`: Run TypeScript type checks.
- `shad-add`: Add a new UI component using Shadcn.
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

## X feature isn't working... HELP!!

1. Are your dependencies up to date? Run `bun install` to make sure you have the latest versions of everything.
2. Is your prisma schema pushed? Run `bun db:push` to make sure your database schema is up to date, or `db:migrate:dev` to apply migrations locally
3. Did your branch up to date? Make sure to pull/merge/rebase from main.
4. Confusing linting errors? Restart your IDE, sometimes the editor gets confused and doesn't pick up on changes.
