# React Boilerplate

###### **React Boilerplate** - _qeleb_
React Boilerplate

---
<details open><summary><h2>Getting Started</h2></summary>

⚠️ Using [Yarn Package Manager](https://yarnpkg.com) is recommended over `npm`.

1. **_(Optional)_** Install the VS Code extensions listed in `.vscode/extensions.json`

1. Use `yarn` to install dependencies
1. Use `yarn dev` to start development server

---
</details>
<details open><summary><h2>Commands</h2></summary>

### Install & Start
1. ⬇️ `yarn` - install dependencies
1. 🧑‍💻 `yarn dev` - start local development server
1. 🖥 `yarn preview` - start local production server

### Build
1. 🔨 `yarn build` - build for production & output to `dist/` with Vite (Esbuild)

### Test
1. 🧪 `yarn test` - run unit tests & generate coverage report in `coverage/`
1. 🧾 `yarn test:ui` - open unit test UI

### Lint
1. 🧹 `yarn lint` - lint files in `src/`
1. 🧼 `yarn lint:fix` - lint files in `src/` & fix automatically

---
</details>
<details><summary><h2>Files</h2></summary>

- `coverage/` - Unit test coverage
- `dist/` - Code output
- `public/` - Static files
- `src/` - Project source code
  - `__tests__/` - Unit test files
  - `assets/` - assets
  - `components/` - UI components
  - `pages/` - Pages
  - `App.tsx` - Parent component
  - `global.d.ts` - Global TypeScript type declarations
  - `index.tsx` - React entry point

---
</details>
<details><summary><h2>Workspace</h2></summary>

### Runtime, Editor, & plugins
____|Required|____|Recommended
---|---|---|---
<a href="https://nodejs.org"><img src="https://nodejs.org/static/images/favicons/android-chrome-512x512.png" alt="NodeJS" height="38"></a>|<sub>Node 18 or later is recommended</sub>|<a href="https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens"><img src="https://usernamehw.gallerycdn.vsassets.io/extensions/usernamehw/errorlens/3.6.0/1658612570729/Microsoft.VisualStudio.Services.Icons.Default" alt="Error Lens" width="38"></a>|<sub>Error Lens for showing warnings & error messages inline exactly where they happen</sub>
<a href="https://code.visualstudio.com"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519" alt="VS Code" height="38"></a>|<sub>VS Code for launch configs, recommended extensions, style guidelines, file associations, & more.</sub>|<a href="https://marketplace.visualstudio.com/items?itemName=WallabyJs.console-ninja"><img src="https://wallabyjs.gallerycdn.vsassets.io/extensions/wallabyjs/console-ninja/0.0.154/1686884057211/Microsoft.VisualStudio.Services.Icons.Default" alt="Console Ninja" width="38"></a>|<sub>Console Ninja for in-editor console output</sub>
<a href="https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint"><img src="https://dbaeumer.gallerycdn.vsassets.io/extensions/dbaeumer/vscode-eslint/2.3.5/1675071602771/Microsoft.VisualStudio.Services.Icons.Default" alt="Eslint" width="38"></a>|<sub>Eslint for linting files according to the custom rule set</sub>|<a href="https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client"><img src="https://rangav.gallerycdn.vsassets.io/extensions/rangav/vscode-thunder-client/2.3.4/1674376565496/Microsoft.VisualStudio.Services.Icons.Default" alt="Thunder Client" height="38"></a>|<sub>Thunder Client for testing API calls</sub>
<a href="https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode"><img src="https://esbenp.gallerycdn.vsassets.io/extensions/esbenp/prettier-vscode/9.10.4/1673460374911/Microsoft.VisualStudio.Services.Icons.Default" alt="Prettier" width="38"></a>|<sub>Prettier for formatting code</sub>|<a href="https://marketplace.visualstudio.com/items?itemName=ZixuanChen.vitest-explorer"><img src="https://zixuanchen.gallerycdn.vsassets.io/extensions/zixuanchen/vitest-explorer/0.2.37/1674182288793/Microsoft.VisualStudio.Services.Icons.Default" alt="Vitest" height="38"></a>|<sub>Vitest displays tests in VS Code</sub>

> Additionally, <a href="https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree"><img src="https://gruntfuggly.gallerycdn.vsassets.io/extensions/gruntfuggly/todo-tree/0.0.223/1675289441988/Microsoft.VisualStudio.Services.Icons.Default" alt="Todo Tree" width="20">Todo Tree</a> is great for seeing an overview of the TODO's & NOTE's in the project.

### Linting
Linting is provided by [ESLint](https://github.com/eslint/eslint) with a custom configurations & the following plugins:
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)
- [eslint-plugin-regexp](https://github.com/ota-meshi/eslint-plugin-regexp)
- [eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)

---
</details>