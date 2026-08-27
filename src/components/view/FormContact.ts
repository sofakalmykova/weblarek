import { IEvents } from "../base/Events";
import { Forms } from "./Forms";
import { TFormContact } from "../../types/index";
import { ensureElement } from "../../utils/utils";

export class FormContact extends Forms<TFormContact> {
  protected inputEmail: HTMLInputElement;
  protected inputPhone: HTMLInputElement;
  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
    this.inputEmail = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.inputPhone = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
  }

  set email(value: string) {
    this.inputEmail.value = value;
  }

  set phone(value: string) {
    this.inputPhone.value = value;
  }
}
