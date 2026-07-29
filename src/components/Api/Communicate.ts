import {
  IApi,
  IProductListResponse,
  IOrder,
  IOrderResponse,
} from "../../types/index";

export class LarekApi {
  private api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }
  async getProductList(): Promise<IProductListResponse> {
    return this.api.get<IProductListResponse>("/product/");
  }

  async createOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
