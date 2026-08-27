import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Forms } from "./Forms";
import { TPayment } from "../../types/index";
import { TFormOrder } from "../../types/index";

export class FormOrder extends Forms<TFormOrder> {
  protected buttonCard: HTMLButtonElement;
  protected buttonCash: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

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

    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );
    this.buttonCard.addEventListener("click", () => {
      this.events.emit("card:ischecked");
    });
    this.buttonCash.addEventListener("click", () => {
      this.events.emit("cash:ischecked");
    });
  }

  set payment(value: TPayment | null) {
    this.buttonCard.classList.remove("button_alt-active");
    this.buttonCash.classList.remove("button_alt-active");

    if (value === "card") {
      this.buttonCard.classList.add("button_alt-active");
    }
    if (value === "cash") {
      this.buttonCash.classList.add("button_alt-active");
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
