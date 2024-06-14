import { createElement } from "../helper/createElement.js";
import { shuffleArray } from "../helper/shuffleArray.js";
import { showAlert } from "./showAlert.js";

export const createPairs = (app) => {
  const pairs = createElement("section", {
    className: "card section-offset",
  });
  const container = createElement("div", {
    className: "container card__container",
  });
  const buttonReturn = createElement("button", {
    className: "card__return",
    arilabel: "повернення до категорій",
  });

  const buttonCard = createElement("button", {
    className: "card__item",
  });

  const front = createElement("span", {
    className: "card__front",
    textContent: "one",
  });
  const back = createElement("span", {
    className: "card__back",
    textContent: "two",
  });

  buttonCard.append(front, back);
  container.append(buttonReturn, buttonCard);
  pairs.append(container);
  const cardControler = (data) => {
    let index = 0;

    front.textContent = data[index][0];
    back.textContent = data[index][1];

    const flipCard = () => {
      buttonCard.classList.add("card__item_flipped");
      buttonCard.removeEventListener("click", flipCard);
      setTimeout(() => {
        buttonCard.classList.remove("card__item_flipped");
        setTimeout(() => {
          index += 1;
          if (index === data.length) {
            front.textContent = "the end";
            showAlert("Повернемось до категорій", 2000);
            setTimeout(() => {
              buttonReturn.click();
            }, 2000);
            return;
          }
          front.textContent = data[index][0];
          back.textContent = data[index][1];
          setTimeout(() => {
            buttonCard.addEventListener("click", flipCard);
          }, 200);
        }, 100);
      }, 1000);
    };

    buttonCard.addEventListener("click", flipCard);
  };

  const mount = (data) => {
    app.append(pairs);
    const newDate = shuffleArray(data.pairs);
    cardControler(newDate);
  };

  const unmount = () => {
    pairs.remove();
  };

  return { buttonReturn, mount, unmount };
};
