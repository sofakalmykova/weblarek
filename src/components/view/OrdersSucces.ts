import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ISuccess } from "../../types/index";

export class SuccessOrder extends Component<ISuccess> {
  protected succsessButton: HTMLButtonElement;
  protected sucsessOrdersPrice: HTMLElement;

  constructor(
    protected event: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.sucsessOrdersPrice = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.succsessButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.succsessButton.addEventListener("click", () => {
      this.event.emit("success:close");
    });
  }

  set orderPrice(price: number) {
    this.sucsessOrdersPrice.textContent = `Списано ${price} синапсов`;
  }
}
