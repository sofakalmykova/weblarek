import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IForms } from "../../types/index";

export class Forms<T> extends Component<IForms & T> {
  protected formsSubmitButton: HTMLButtonElement;
  protected formsError: HTMLElement;
  protected readonly form: HTMLFormElement;
  constructor(
    protected events: IEvents,
    container: HTMLFormElement,
  ) {
    super(container);
    this.form = container;
    this.formsSubmitButton = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    );
    this.formsError = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.container.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      this.events.emit<{ name: string; value: string }>("field:change", {
        name: target.name,
        value: target.value,
      });
    });
    this.formsSubmitButton.addEventListener("click", (e) => {
      e.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.formsSubmitButton.disabled = !value;
  }
  set formserrors(value: string) {
    this.formsError.textContent = value;
  }
}
