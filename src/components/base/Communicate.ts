import {
  IApi,
  ProductListResponse,
  Order,
  OrderResponce,
} from "../../types/index";

export class CommunicateWithApi {
  private _api: IApi;
  constructor(api: IApi) {
    this._api = api;
  }
  async getProductList(): Promise<ProductListResponse> {
    return await this._api.get<ProductListResponse>("/product/");
  }

  async createOrder(order: Order): Promise<OrderResponce> {
    return await this._api.post<OrderResponce>("/order/", order);
  }
}
