import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Forms } from "./Forms";
import { TPayment } from "../../types/index";
import { IFormOrder } from "../../types/index";

export class FormOrder extends Forms<IFormOrder> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.buttonCard = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container,
    );
    this.buttonCash = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container,
    );
    this.buttonCard.addEventListener("click", () => {
      this.events.emit("card:ischecked");
    });
    this.buttonCash.addEventListener("click", () => {
      this.events.emit("cash:ischecked");
    });
  }

  set paymentTypeActive(value: TPayment) {
    this.buttonCard.classList.remove("button_alt-active");
    this.buttonCash.classList.remove("button_alt-active");

    if (value === "card") {
      this.buttonCard.classList.add("button_alt-active");
    }
    if (value === "cash") {
      this.buttonCash.classList.add("button_alt-active");
    }
  }
}
