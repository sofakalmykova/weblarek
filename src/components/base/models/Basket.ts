import { IProduct } from "../../../../src/types/index";
export class Basket {
  private _products: IProduct[] = [];
  getProducts(): IProduct[] {
    return [...this._products];
  }
  addProduct(item: IProduct): void {
    this._products.push(item);
  }
  deleteProduct(item: IProduct): void {
    const indexItem: number = this._products.indexOf(item);
    this._products.splice(indexItem, 1);
  }
  clearing(): void {
    this._products = [];
  }
  getTotlaPrice(): number {
    let totalPrice = 0;
    this._products.forEach((element: IProduct): void => {
      if (element.price !== null) {
        totalPrice += element.price;
      }
    });
    return totalPrice;
  }
  getCount(): number {
    const count = this._products.length;
    return count;
  }

  hasProductById(id: string): boolean {
    const include = this._products.some((item) => item.id === id);
    return include;
  }
}
