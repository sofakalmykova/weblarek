import "./scss/styles.scss";
import { Basket } from "./components/base/models/Basket";
import { Catalog } from "./components/base/models/Catalog";
import { Buyer } from "./components/base/models/Buyer";
import { apiProducts } from "./utils/data";
import { IBuyer } from "./types/index";
import { CommunicateWithApi } from "./components/base/Communicate";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
const catalogModel = new Catalog();
catalogModel.setProducts(apiProducts.items);
console.log(`Массив товаров из каталога: `, catalogModel.getProducts());
console.log(
  `выбор товара по ид: `,
  catalogModel.getProductById(apiProducts.items[3].id),
);
catalogModel.setSelectedProduct(apiProducts.items[2]);
console.log("получение выбранного товара", catalogModel.getSelectedProduct());

const basketModel = new Basket();
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[3]);
console.log(`товары в корзине: `, basketModel.getProducts());
basketModel.deleteProduct(apiProducts.items[3]);
console.log(`товары в корзине: `, basketModel.getProducts());
basketModel.addProduct(apiProducts.items[3]);
basketModel.clearing();
console.log(`товары в корзине: `, basketModel.getProducts());
basketModel.addProduct(apiProducts.items[0]);
basketModel.addProduct(apiProducts.items[2]);
basketModel.addProduct(apiProducts.items[3]);
console.log(`общая стоимость: `, basketModel.getTotlaPrice());
console.log(`Товаров в корзине: `, basketModel.getCount());
console.log(
  `ЕСТЬ ЛИ ТАКОЙ ТОВАР: `,
  basketModel.hasProductById(apiProducts.items[3].id),
);

const buyers: IBuyer[] = [
  { payment: "card", email: "cfdfdfd", phone: "879997", address: "dvdvgdev" },
  { payment: "cash", email: "", phone: "734735", address: "" },
  { payment: "", email: "rrerdv", phone: "734735", address: "gvrfvg" },
];

const buyerModel = new Buyer();

buyerModel.setPayment(buyers[0].payment);
buyerModel.setAddress(buyers[0].address);
buyerModel.setEmail(buyers[0].email);
buyerModel.setPhone(buyers[0].phone);

console.log(`Покупатель: `, buyerModel.getBuyer());
console.log(`валидация: `, buyerModel.valid());

const api = new Api(API_URL);
const server = new CommunicateWithApi(api);
const catalogModelWithApi = new Catalog();

(async () => {
  try {
    const response = await server.getProductList();
    catalogModelWithApi.setProducts(response.items);

    console.log("Каталог загружен:", catalogModelWithApi.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
})();
