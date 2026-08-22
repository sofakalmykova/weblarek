import { IEvents } from "../base/Events";
import { Forms } from "./Forms";
import { IFormContact } from "../../types/index";

export class FormContact extends Forms<IFormContact> {
  constructor(events: IEvents, container: HTMLFormElement) {
    super(events, container);
  }
}
