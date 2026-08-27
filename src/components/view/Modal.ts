import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IModal } from "../../types/index";

export class Modal extends Component<IModal> {
  protected modalCloseButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(container: HTMLElement) {
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
      this.close();
    });
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }
  set content(item: HTMLElement) {
    this.modalContent.replaceChildren(item);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
  }
}
