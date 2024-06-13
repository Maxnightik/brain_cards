import { createElement } from "../helper/createElement.js";

export const createHeader = (parent) => {
  const container = createElement("div", {
    className: "container header__container",
  });

  parent.append(container);

  const headerLogoLink = createElement("a", {
    href: "#",
    className: "header__logo-link",
    alt: "Логотип сервису Brain Cards",
  });

  const logo = createElement("img", {
    src: "img/logo.svg",
    className: "header__logo",
    alt: "Логотип сервісу Brain Cards",
  });

  headerLogoLink.append(logo);

  const headerTitle = createElement("h2", {
    className: "header__subtitle",
    textContent: "Категорії",
  });

  const headerBtn = createElement("button", {
    className: "header__btn",
    textContent: "Додати категорію",
  });

  container.append(headerLogoLink, headerTitle, headerBtn);

  const upadateHeaderTitle = (title) => {
    headerTitle.textContent = title;
  };

  return {
    headerLogoLink,
    headerBtn,
    upadateHeaderTitle,
  };
};
