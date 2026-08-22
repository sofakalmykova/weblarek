import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../base/Events";
import { ICardByBasket } from "../../types/index";

export class CardByBasket extends Card<ICardByBasket> {
  protected cardsIndex: HTMLElement;
  protected cardsButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.cardsButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    this.cardsIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardsButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentId = this.cardproductId;
      this.events.emit("basketItem:delete", { id: currentId });
    });
  }

  set index(value: number) {
    this.cardsIndex.textContent = String(value);
  }
}
