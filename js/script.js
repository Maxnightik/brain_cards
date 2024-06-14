import { createCategory } from "./components/createCategory.js";
import { createEditCategory } from "./components/createEditCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createElement } from "./helper/createElement.js";
import { fetchCards, fetchCategories } from "./service/api.service.js";

const initApp = async () => {
  const headerParent = document.querySelector(".header");
  const app = document.querySelector("#app");

  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);
  const editCategoryObj = createEditCategory(app);

  const allSectionUnmount = () => {
    [categoryObj, editCategoryObj].forEach((obj) => obj.unmount());
  };

  const returnIndex = async (e) => {
    e?.preventDefault();
    allSectionUnmount();
    const categories = await fetchCategories();
    if (categories.error) {
      const errorText = createElement("p", {
        className: "server-error",
        textContent: "Помилка серверу, спробуйти зайти пізніше",
      });
      app.append(errorText);
      return;
    }

    categoryObj.mount(categories);
  };

  returnIndex();

  headerObj.headerLogoLink.addEventListener("click", returnIndex);

  headerObj.headerBtn.addEventListener("click", () => {
    allSectionUnmount();
    headerObj.upadateHeaderTitle("Нова Категорія");
    editCategoryObj.mount();
  });

  categoryObj.categoryList.addEventListener("click", async ({ target }) => {
    const categoryItem = target.closest(".category__item");

    if (target.closest(".category__edit")) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.upadateHeaderTitle("Редагування");
      editCategoryObj.mount(dataCards);
      return;
    }
  });
};

initApp();
