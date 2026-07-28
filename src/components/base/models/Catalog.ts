import { IProduct } from "../../../../src/types/index";
export class Catalog {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;

  setProducts(products: IProduct[]): void {
    this._products = [...products];
  }
  getProducts(): IProduct[] {
    return [...this._products];
  }
  getProductById(id: string): IProduct | undefined {
    return this._products.find((product) => product.id === id);
  }
  setSelectedProduct(selectProduct: IProduct | null): void {
    if (!selectProduct) {
      this._selectedProduct = null;
      return;
    }
    const productById = this._products.find(
      (product) => product.id === selectProduct.id,
    );
    if (productById) {
      this._selectedProduct = productById;
    } else {
      this._selectedProduct = null;
    }
  }
  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}
