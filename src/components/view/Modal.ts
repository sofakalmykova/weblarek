import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModal } from "../../types/index";

export class Modal extends Component<IModal> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.modalCloseButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.modalCloseButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.events.emit("modal:close");
      }
    });
  }
  set content(item: HTMLElement) {
    this.modalContent.replaceChildren(item);
  }

  set modalISActive(isActive: boolean) {
    if (isActive) {
      this.container.classList.add("modal_active");
    } else {
      this.container.classList.remove("modal_active");
    }
  }
}
