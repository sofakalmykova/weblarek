import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IBasket } from "../../types";

export class BasketForModal extends Component<IBasket> {
  protected busketList: HTMLElement;
  protected busketPrice: HTMLElement;
  protected busketButton: HTMLButtonElement;

  constructor(
    protected event: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.busketList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.busketPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
    this.busketButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.busketButton.addEventListener("click", () => {
      this.event.emit("order:make");
    });
  }

  set price(price: number) {
    this.busketPrice.textContent = `${price} синапсов`;
  }

  set list(items: HTMLElement[]) {
    this.busketList.replaceChildren(...items);
  }

  set buttonIsActive(value: boolean) {
    this.busketButton.disabled = !value;
  }
}
