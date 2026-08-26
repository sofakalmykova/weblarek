import { IBuyer, TPayment, IBuyerErrors } from "../../types/index";
import { IEvents } from "../base/Events";
export class Buyer {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  constructor(protected events: IEvents) {}

  setPayment(payment: TPayment | null): void {
    this.payment = payment;
    this.events.emit("buyer:changed", { field: "payment" });
  }
  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyer:changed", { field: "email" });
  }
  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyer:changed", { field: "phone" });
  }
  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyer:changed", { field: "address" });
  }

  getBuyer(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events.emit("buyer:changed");
  }

  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (!this.payment || this.payment === null) {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this.email || this.email.trim().length === 0) {
      errors.email = "Не указан адрес электронной почты";
    }
    if (!this.phone || this.phone.trim().length === 0) {
      errors.phone = "Не указан номер телефона";
    }
    if (!this.address || this.address.trim().length === 0) {
      errors.address = "Не указан адрес";
    }
    return errors;
  }
}
