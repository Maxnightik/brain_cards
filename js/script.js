import { createCategory } from "./components/createCategory.js";
import { createEditCategory } from "./components/createEditCategory.js";
import { createHeader } from "./components/createHeader.js";
import { createPairs } from "./components/createPairs.js";
import { showAlert } from "./components/showAlert.js";
import { createElement } from "./helper/createElement.js";
import {
  fetchCards,
  fetchCategories,
  fetchCreateCategory,
  fetchDeleteCategory,
  fetchEditCategory,
} from "./service/api.service.js";

const initApp = async () => {
  const headerParent = document.querySelector(".header");
  const app = document.querySelector("#app");

  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);
  const editCategoryObj = createEditCategory(app);
  const pairsObj = createPairs(app);

  const allSectionUnmount = () => {
    [categoryObj, editCategoryObj, pairsObj].forEach((obj) => obj.unmount());
  };

  const postHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchCreateCategory(data);
    if (dataCategories.error) {
      showAlert(dataCategories.error.message);
      return;
    }

    showAlert(`Нова категорія ${data.title} була додана`);
    allSectionUnmount();
    headerObj.upadateHeaderTitle("Категорії");
    categoryObj.mount(dataCategories);
  };

  const patchHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchEditCategory(
      editCategoryObj.btnSave.dataset.id,
      data
    );
    if (dataCategories.error) {
      showAlert(dataCategories.error.message);
      return;
    }

    showAlert(`Категорія ${data.title} оновлена`);
    allSectionUnmount();
    headerObj.upadateHeaderTitle("Категорії");
    categoryObj.mount(dataCategories);
  };

  const renderIndex = async (e) => {
    e?.preventDefault();
    allSectionUnmount();
    const categories = await fetchCategories();
    headerObj.upadateHeaderTitle("Категорії");
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

  renderIndex();

  headerObj.headerLogoLink.addEventListener("click", renderIndex);

  headerObj.headerBtn.addEventListener("click", () => {
    allSectionUnmount();
    headerObj.upadateHeaderTitle("Нова Категорія");
    editCategoryObj.mount();
    editCategoryObj.btnSave.addEventListener("click", postHandler);
    editCategoryObj.btnSave.removeEventListener("click", patchHandler);
  });

  categoryObj.categoryList.addEventListener("click", async ({ target }) => {
    const categoryItem = target.closest(".category__item");

    if (target.closest(".category__edit")) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.upadateHeaderTitle("Редагування");
      editCategoryObj.mount(dataCards);
      editCategoryObj.btnSave.addEventListener("click", patchHandler);
      editCategoryObj.btnSave.removeEventListener("click", postHandler);
      return;
    }
    if (target.closest(".category__del")) {
      if (confirm("Ви впевнені, що хочете видалити категорію")) {
        const result = fetchDeleteCategory(categoryItem.dataset.id);

        if (result.error) {
          showAlert(result.error.message);
          return;
        }

        showAlert("Категорія видалена!");
        categoryItem.remove();
      }

      return;
    }

    if (categoryItem) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.upadateHeaderTitle(dataCards.title);
      pairsObj.mount(dataCards);
    }
  });

  pairsObj.buttonReturn.addEventListener("click", renderIndex);
};

initApp();
