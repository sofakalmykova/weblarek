export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash";

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type IBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IProductListResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export interface IBasket {
  price: number;
  list: HTMLElement[];
  buttonIsActive: boolean;
}

export type TCard = Pick<IProduct, "title" | "price" | "id">;

export interface ICardByBasket {
  index: number;
}

export type TCardByCatalog = Pick<IProduct, "category" | "image"> & {
  alt: string;
};
export type TImageWithAlt = Pick<TCardByCatalog, "image" | "alt">;

export type TCardByModal = Pick<
  IProduct,
  "category" | "image" | "description"
> & {
  alt: string;
} & { button: TButtonVariations };

export type TButtonVariations = "buy" | "remove" | "unavailable";

export interface IFormContact {}
export interface IFormOrder {
  paymentTypeActive: TPayment;
}
export interface IForms {
  formserrors: string;
  valid: boolean;
}
export interface IGallery {
  catalog: HTMLElement[];
}
export interface IHeader {
  counter: number;
}

export interface IModal {
  content: HTMLElement | HTMLElement[];
  modalISActive: boolean;
}

export interface ISuccess {
  orderPrice: number;
}
