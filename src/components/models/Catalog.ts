import { IProduct } from "../../types/index";
export class Catalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this.products = [...products];
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
      return;
    }
    const productById = this.products.find(
      (product) => product.id === selectProduct.id,
    );
    if (productById) {
      this.selectedProduct = productById;
    } else {
      this.selectedProduct = null;
    }
  }
  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
