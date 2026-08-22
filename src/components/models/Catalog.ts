import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";
export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;
  constructor(protected events: IEvents) {}
  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit("catalog:products-updated");
  }
  getProducts(): IProduct[] {
    return [...this.products];
  }
  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }
  setSelectedProduct(selectProduct: IProduct | null): void {
    if (!selectProduct) {
      this.selectedProduct = null;
      this.events.emit("catalog:selected-product-changed", { product: null });
      return;
    }
    const productById = this.products.find(
      (product) => product.id === selectProduct.id,
    );
    if (productById) {
      this.selectedProduct = productById;
      this.events.emit("catalog:selected-product-changed", {
        product: productById,
      });
    } else {
      this.selectedProduct = null;
      this.events.emit("catalog:selected-product-changed", { product: null });
    }
  }
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
