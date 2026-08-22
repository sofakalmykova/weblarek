import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { TCard } from "../../types/index";

export class Card<T> extends Component<TCard & T> {
  protected cardsTitle: HTMLElement;
  protected cardsPrice: HTMLElement;
  protected cardproductId: string | null = null;
  constructor(container: HTMLElement) {
    super(container);
    this.cardsTitle = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.cardsPrice = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set id(item: string) {
    this.cardproductId = item;
  }

  set title(value: string) {
    this.cardsTitle.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.cardsPrice.textContent = `Бесценно`;
    } else {
      this.cardsPrice.textContent = `${value} синапсов`;
    }
  }
}
