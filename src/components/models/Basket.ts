import { IProduct } from "../../types/index";
export class Basket {
  private products: IProduct[] = [];
  getProducts(): IProduct[] {
    return [...this.products];
  }
  addProduct(item: IProduct): void {
    this.products.push(item);
  }
  deleteProduct(item: IProduct): void {
    this.products = this.products.filter(product => product.id !== item.id);
  }
  clear(): void {
    this.products = [];
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
