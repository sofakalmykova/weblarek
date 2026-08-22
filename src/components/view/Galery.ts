import { Component } from "../base/Component";
import { IGallery } from "../../types/index";

export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;
  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container;
  }

  set catalog(itemList: HTMLElement[]) {
    this.catalogElement.replaceChildren(...itemList);
  }
}
