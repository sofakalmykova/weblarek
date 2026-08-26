import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";
import { ICardByBasket } from "../../types/index";
import { ICardActions } from "../../types/index";

export class CardByBasket extends Card<ICardByBasket> {
  protected cardsIndex: HTMLElement;
  protected cardsButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    actions?: ICardActions
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
    if (actions?.onDelete) {
       this.cardsButton.addEventListener('click', actions.onDelete)
    }
  }

  set index(value: number) {
    this.cardsIndex.textContent = String(value);
  }
}
