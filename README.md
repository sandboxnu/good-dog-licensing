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

## Structure

The repository is organized as follows:

- **apps/**: Contains the main applications.
  - **db/**: Database-related scripts and configurations.
  - **web/**: The web application built with Next.js.
- **packages/**: Contains shared packages.
  - **trpc/**: tRPC-related code.
  - **ui/**: UI components and utilities.
- **tooling/**: Contains configuration and tooling for the project.
  - **eslint/**: ESLint configurations.
  - **github/**: GitHub Actions and workflows.
  - **prettier/**: Prettier configurations.
  - **tailwind/**: Tailwind CSS configurations.
  - **typescript**: TypeScript configurations.
- **.vscode/**: Contains Visual Studio Code settings and recommended extensions.
- **node_modules/**: Contains installed dependencies.
- **package.json**: Contains project metadata and scripts.
- **tsconfig.json**: Contains TypeScript configuration.
- **README.md**: The main documentation file for the project.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Bun](https://bun.sh/) >= 1.1.27
- [Docker](https://www.docker.com/) >= 20.10.7

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
- `bun test`: Run the test suites

## Tesing in Preview

To test the application in a the environment, follow these steps:

1. Create a PR with the changes you want to test.

2. Push the changes to the branch.

3. Navigate to the PR on GitHub.

4. Look for the "Deploy preview ready" status check.

5. If you have database migrations, click the "Actions" tab on GitHub and look for the "Apply Preview Database Migrations" workflow.

   - You should see a "Run workflow" button. Click it to run the workflow. Make sure to select the correct branch.

   - One the workflow is complete, you can access your preview branch with the database migrations applied

   - Note that we only have one database instance for all preview branches, so if someone else runs the workflow, it may interfere with your preview branch.
