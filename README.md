



## 1. Environment preparation
### Setup NodeJs
- https://nodejs.org/en
- keep default settings
- `node -v`

If node -v returns error, set PATH:
- `WIN` + `R`
- `sysdm.cpl`
- Advanced -> Environment Variables -> Path -> Edit
- add `C:\Program Files\nodejs\`

### Install GIT for Windows
- https://git-scm.com/downloads/win
- `Use Visual Studio Code as Git's default editor`
- `Use Windows' default console window`


## 2. Setup VSCode
### Install Extensions
- Playwright Test for VSCode
- Prettier - Code formatter
- ESLint
- GitLens — Git supercharged
- vscode-icons

**For all**: Add to Workspace Recommendations
Workspace recommendations are saved in `.vscode/extensions.json`

### Install Playwright
- `CTRL` + `SHIFT` + `P`
- `Test: Install Playwright`
- **OR** `npm init playwright@latest --yes "--" . '--quiet' '--browser=chromium'`

### Setup Prettier
- `npm i -D prettier`
- `npm install --save-dev @trivago/prettier-plugin-sort-imports`
- create `.vscode/settings.json` and insert content
- create `.prettierignore` and insert content
- create `.prettierrc.json` and insert content
- in `package.json` insert the script `"format": "npx prettier --write ."`

### Setup ESLint
- `npm init @eslint/config@latest`
- `npm i -D eslint-plugin-prettier`
- `npm i -D eslint-config-prettier`
- `npm i -D eslint-plugin-playwright`
- in `eslint.config.mts` insert content
- in `package.json` insert the script `"lint": "npx eslint . --max-warnings=0"`

### Setup Husky
- `npm install husky --save-dev`
- `npx husky init`
- `echo "npm run lint" > .husky/pre-commit`
- open `.husky/pre-commit` and change encoding to UFT-8

### Setup Playwright
- in `playwright.config.ts` insert content

### Setup Coding Standards
- create `tsconfig.json` and insert content


## 3. Write tests
### Create page objects

### Run tests
- `npx playwright test`
- `npx playwright test --grep "@GAD-R01-01"`
- `npx playwright test --grep "@GAD-R01-01|@GAD-R01-02"`
- `npx playwright test --grep-invert "@GAD-R01-01"`
- `npx playwright test --repeat-each 10`

### Create .env
- `npm i -D dotenv`
- create `.env` and `.env-template`
- create `src/global-setup.ts` and insert content

### Install Faker
- `npm i -D @faker-js/faker`

### Login as project
- session state file with login data is created in `login.setup.ts`
- file is used in dependent project `logged`, this way 

### Aliases in imports
- in `tsconfig.json` insert `baseUrl` and `paths`
- substitute `../../src` with `@_src`


## 4. CI/CD

###