import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { categoryMap } from "../../utils/constants";
import { TCardByCatalog } from "../../types/index";
import { TImageWithAlt } from "../../types/index";
import { ICardActions } from "../../types/index";

export class CardByCatalog extends Card<TCardByCatalog> {
  protected cardsCategory: HTMLElement;
  protected cardsImage: HTMLImageElement;
  constructor(
    container: HTMLElement, actions?: ICardActions
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

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick)
    }
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
}
