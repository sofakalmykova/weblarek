import { IBuyer, TPayment, Errors } from "../../../../src/types/index";
export class Buyer {
  private _payment: TPayment;
  private _email: string;
  private _phone: string;
  private _address: string;

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }
  setEmail(email: string): void {
    this._email = email;
  }
  setPhone(phone: string): void {
    this._phone = phone;
  }
  setAddress(address: string): void {
    this._address = address;
  }

  getBuyer(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clearing(): void {
    this._payment = "";
    this._email = "";
    this._phone = "";
    this._address = "";
  }

  valid(): Errors {
    const errors: Errors = {};
    if (!this._payment || this._payment.trim() === "") {
      errors.payment = "Не выбран способ оплаты";
    }
    if (!this._email || this._email.trim().length === 0) {
      errors.email = "Не указан адрес электронной почты";
    }
    if (!this._phone || this._phone.trim().length === 0) {
      errors.phone = "Не указан номер телефона";
    }
    if (!this._address || this._address.trim().length === 0) {
      errors.address = "Не указан адресс";
    }
    return errors;
  }
}
