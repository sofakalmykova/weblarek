import "./scss/styles.scss";
import { Basket } from "./components/models/Basket";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { apiProducts } from "./utils/data";
import { IBuyer } from "./types/index";
import { LarekApi } from "./components/Api/Communicate";
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
basketModel.addProduct(apiProducts.items[2]);
basketModel.addProduct(apiProducts.items[3]);
console.log(`товары в корзине: `, basketModel.getProducts());
console.log(`общая стоимость: `, basketModel.getTotalaPrice());
console.log(`Товаров в корзине: `, basketModel.getCount());
console.log(
  `ЕСТЬ ЛИ ТАКОЙ ТОВАР: `,
  basketModel.hasProductById(apiProducts.items[3].id),
);

basketModel.deleteProduct(apiProducts.items[0]);
console.log(`товары в корзине: `, basketModel.getProducts());
basketModel.clear();
console.log(`товары в корзине: `, basketModel.getProducts());


const buyers: IBuyer[] = [
  { payment: "card", email: "cfdfdfd", phone: "879997", address: "dvdvgdev" },
  { payment: "cash", email: "", phone: "734735", address: "" },
  { payment: null, email: "rrerdv", phone: "734735", address: "gvrfvg" },
];

const buyerModel = new Buyer();

buyerModel.setPayment(buyers[0].payment);
buyerModel.setAddress(buyers[0].address);
buyerModel.setEmail(buyers[0].email);
buyerModel.setPhone(buyers[0].phone);

console.log(`Покупатель 1: `, buyerModel.getBuyer());
console.log(`валидация: `, buyerModel.validate());

buyerModel.setPayment(buyers[1].payment);
buyerModel.setAddress(buyers[1].address);
buyerModel.setEmail(buyers[1].email);
buyerModel.setPhone(buyers[1].phone);

console.log(`Покупатель 2: `, buyerModel.getBuyer());
console.log(`валидация: `, buyerModel.validate());

buyerModel.setPayment(buyers[2].payment);
buyerModel.setAddress(buyers[2].address);
buyerModel.setEmail(buyers[2].email);
buyerModel.setPhone(buyers[2].phone);

console.log(`Покупатель 3: `, buyerModel.getBuyer());
console.log(`валидация: `, buyerModel.validate());

buyerModel.clear()
console.log(`Данные покупателя после очистки `, buyerModel.getBuyer());


const api = new Api(API_URL);
const server = new LarekApi(api);
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
