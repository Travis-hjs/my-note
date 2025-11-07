import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

const pages = [
  {
    page: "home",
    name: "首页"
  },
  {
    page: "about",
    name: "项目工程说明"
  }
];

const navList = pages.map(page => (`<li><a href="/src/pages/${page.page}/">${page.name}</a></li>`)).join("");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript 工程</h1>
    <p class="read-the-docs">
      点击进入对应页面目录
    </p>
    <ul>${navList}</ul>
  </div>
`;
