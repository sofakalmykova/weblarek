import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";
export class Basket {
  private products: IProduct[] = [];
  constructor(protected events: IEvents) {}
  getProducts(): IProduct[] {
    return [...this.products];
  }
  addProduct(item: IProduct): void {
    this.products.push(item);
    this.events.emit("basket:changed");
  }
  deleteProduct(item: IProduct): void {
    this.products = this.products.filter((product) => product.id !== item.id);
    this.events.emit("basket:changed");
  }
  clear(): void {
    const cleared = [...this.products];
    this.products = [];
    this.events.emit("basket:changed");
  }

  getTotalaPrice(): number {
    let totalPrice = 0;
    this.products.forEach((element: IProduct): void => {
      if (element.price !== null) {
        totalPrice += element.price;
      }
    });
    return totalPrice;
  }
  getCount(): number {
    return this.products.length;
  }

  hasProductById(id: string): boolean {
    return this.products.some((item) => item.id === id);
  }
}
