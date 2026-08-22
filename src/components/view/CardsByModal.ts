import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";
import { TImageWithAlt } from "../../types/index";
import { TCardByModal } from "../../types/index";
import { TButtonVariations } from "../../types/index";

export class CardByModal extends Card<TCardByModal> {
  protected cardsCategory: HTMLElement;
  protected cardsImage: HTMLImageElement;
  protected cardsDescription: HTMLElement;
  protected cardsButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.cardsCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.cardsImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.cardsDescription = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.cardsButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.cardsButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentId = this.cardproductId;
      this.events.emit("cardbutton: clicked", { id: currentId });
    });
  }

  set image(value: TImageWithAlt) {
    this.cardsImage.src = value.image;
    this.cardsImage.alt = value.alt;
  }

  set category(value: string) {
    Object.values(categoryMap).forEach((cls) => {
      this.cardsCategory.classList.remove(cls);
    });
    const classForCategory = categoryMap[value as keyof typeof categoryMap];
    this.cardsCategory.classList.add(classForCategory);
    this.cardsCategory.textContent = value;
  }

  set description(value: string) {
    this.cardsDescription.textContent = value;
  }

  set button(value: TButtonVariations) {
    if (value === "buy") {
      this.cardsButton.textContent = "Купить";
    }
    if (value === "remove") {
      this.cardsButton.textContent = "Удалить из корзины";
    }
    if (value === "unavailable") {
      this.cardsButton.textContent = "Недоступно";
      this.cardsButton.disabled = true;
    }
  }
}
