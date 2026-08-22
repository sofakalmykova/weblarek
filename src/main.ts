import "./scss/styles.scss";
import { Basket } from "./components/models/Basket";
import { Catalog } from "./components/models/Catalog";
import { Buyer } from "./components/models/Buyer";
import { IBuyer } from "./types/index";
import { LarekApi } from "./components/Api/Communicate";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { Header } from "./components/view/Header";
import { EventEmitter } from "./components/base/Events";
import { ensureElement } from "./utils/utils";
import { Gallery } from "./components/view/Galery";
import { IProduct } from "./types/index";
import { CardByCatalog } from "./components/view/CardByCatalog";
import { Modal } from "./components/view/Modal";
import { CardByModal } from "./components/view/CardsByModal";
import { CardByBasket } from "./components/view/CardByBasket";
import { SuccessOrder } from "./components/view/OrdersSucces";
import { BasketForModal } from "./components/view/BasketForModal";
import { FormContact } from "./components/view/FormContact";
import { FormOrder } from "./components/view/FormOrder";
import { TPayment } from "./types/index";
import { IOrder } from "./types/index";

const api = new Api(API_URL);
const server = new LarekApi(api);
const events = new EventEmitter();
const catalogModelWithApi = new Catalog(events);
const galerryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galerryContainer);
const modalsContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(events, modalsContainer);
const basket = new Basket(events);
const headerContainer = ensureElement<HTMLElement>(".header");
const header = new Header(events, headerContainer);
const buyerModal = new Buyer(events);
let isOrderSucces = false;
function basketRender(): void {
  if (isOrderSucces) {
    return;
  }
  const template = ensureElement<HTMLTemplateElement>("#basket");
  if (!template) {
    throw new Error("Не найден шаблон");
  }
  const basketContainer = template.content.cloneNode(true) as HTMLElement;
  const basketView = new BasketForModal(events, basketContainer);
  basketView.price = basket.getTotalaPrice();
  const basketList: IProduct[] = basket.getProducts();
  const basketsProductElements: HTMLElement[] = basketList.map(
    (product: IProduct) => {
      const template = ensureElement<HTMLTemplateElement>("#card-basket");
      const cardContainer = template.content.cloneNode(true) as HTMLElement;
      const cardByBasket = new CardByBasket(events, cardContainer);
      cardByBasket.id = product.id;
      cardByBasket.title = product.title;
      cardByBasket.price = product.price;
      cardByBasket.index = basketList.indexOf(product) + 1;
      cardByBasket.render();
      return cardContainer;
    },
  );
  basketView.list = basketsProductElements;
  if (basketList.length === 0) {
    basketView.buttonIsActive = false;
  }
  basketView.render();
  modal.content = basketContainer;
  modal.render();
}

const validationRules = {
  step1: ["payment", "address"] as const,
  step2: ["phone", "email"] as const,
} as const;

type StepName = keyof typeof validationRules;
let currentStep: StepName = "step1";
let currentForm: FormOrder | FormContact | null = null;

const updateValidation = () => {
  if (!currentForm) {
    return;
  }
  const allErrors = buyerModal.validate();
  console.log(allErrors);
  const fieldsToCheck = validationRules[currentStep];
  const errorMessages = fieldsToCheck
    .filter((field) => allErrors[field])
    .map((field) => allErrors[field]!);
  let errorText = "";
  if (errorMessages.length > 0) {
    errorText = errorMessages.join("; ");
  }
  currentForm.formserrors = errorText;
  currentForm.valid = errorMessages.length === 0;
};

events.on("catalog:products-updated", () => {
  const products = catalogModelWithApi.getProducts();
  const cardElements: HTMLElement[] = products.map((product: IProduct) => {
    const template = ensureElement<HTMLTemplateElement>("#card-catalog");
    if (!template) {
      throw new Error("Не найден шаблон");
    }
    const cardContainer = template.content.cloneNode(true) as HTMLElement;
    const cardContainerButton = ensureElement<HTMLButtonElement>(
      ".gallery__item",
      cardContainer,
    );
    const cardByCatalog = new CardByCatalog(events, cardContainerButton);
    cardByCatalog.image = {
      image: product.image,
      alt: `${product.title} — ${product.category}`,
    };
    cardByCatalog.category = product.category;
    cardByCatalog.title = product.title;
    cardByCatalog.price = product.price;
    cardByCatalog.id = product.id;
    cardByCatalog.render();
    return cardContainerButton;
  });
  gallery.catalog = cardElements;
});

events.on("card:selected", ({ id }: { id: string }) => {
  const product = catalogModelWithApi.getProductById(id);
  if (!product) {
    return;
  }
  catalogModelWithApi.setSelectedProduct(product);
});

events.on(
  "catalog:selected-product-changed",
  ({ product }: { product: IProduct | null }) => {
    if (!product) {
      modal.modalISActive = false;
    } else {
      modal.modalISActive = true;
      const template = ensureElement<HTMLTemplateElement>("#card-preview");
      if (!template) {
        throw new Error("Не найден шаблон");
      }
      const cardPrewiewContainer = template.content.cloneNode(
        true,
      ) as HTMLElement;
      const cardPrewiew = new CardByModal(events, cardPrewiewContainer);

      cardPrewiew.category = product.category;
      cardPrewiew.description = product.description;
      cardPrewiew.image = {
        image: product.image,
        alt: `${product.title} — ${product.category}`,
      };
      cardPrewiew.title = product.title;
      cardPrewiew.id = product.id;
      cardPrewiew.price = product.price;

      const isInBusket = basket.hasProductById(product.id);
      if (isInBusket) {
        cardPrewiew.button = "remove";
      } else {
        if (product.price === null) {
          cardPrewiew.button = "unavailable";
        } else {
          cardPrewiew.button = "buy";
        }
      }
      cardPrewiew.render();

      modal.content = cardPrewiewContainer;
      modal.render();
    }
  },
);

events.on("modal:close", () => {
  modal.modalISActive = false;
  currentStep = "step1";
  buyerModal.clear();
});

events.on("cardbutton: clicked", ({ id }: { id: string }) => {
  const product = catalogModelWithApi.getSelectedProduct();
  if (!product) return;
  const isInBasket = basket.hasProductById(product.id);
  if (isInBasket) {
    basket.deleteProduct(product);
  } else {
    if (product.price === null) {
      return;
    }
    basket.addProduct(product);
  }
  modal.modalISActive = false;
});

events.on("basket:open", () => {
  modal.modalISActive = true;
  basketRender();
});

events.on("basket:changed", () => {
  header.counter = basket.getCount();
  basketRender();
});

events.on("basketItem:delete", ({ id }: { id: string }) => {
  const product = catalogModelWithApi.getProductById(id);
  if (!product) {
    return;
  }
  basket.deleteProduct(product);
});

events.on(
  "field:change",
  ({ name, value }: { name: string; value: string }) => {
    if (name === "address") {
      buyerModal.setAddress(value);
    }
    if (name === "email") {
      buyerModal.setEmail(value);
    }
    if (name === "phone") {
      buyerModal.setPhone(value);
    }
  },
);

events.on("buyer:set-payment", ({ payment }: { payment: TPayment }) => {
  if (currentForm instanceof FormOrder)
    (currentForm as FormOrder).paymentTypeActive = payment;
});

events.on("card:ischecked", () => {
  buyerModal.setPayment("card");
});

events.on("cash:ischecked", () => {
  buyerModal.setPayment("cash");
});

events.on("order:make", () => {
  const template = ensureElement<HTMLTemplateElement>("#order");
  if (!template) {
    throw new Error("Не найден шаблон");
  }
  const ordersContainer = template.content.cloneNode(true) as HTMLElement;
  const orderFormContainer = ensureElement<HTMLFormElement>(
    ".form",
    ordersContainer,
  );
  currentForm = new FormOrder(events, orderFormContainer);

  modal.content = orderFormContainer;
  modal.render();
  updateValidation();
});

events.on("buyer:changed", () => {
  updateValidation();
});

events.on("order:submit", () => {
  currentStep = "step2";
  const template = ensureElement<HTMLTemplateElement>("#contacts");
  if (!template) {
    throw new Error("Не найден шаблон");
  }
  const contactsContainer = template.content.cloneNode(true) as HTMLElement;
  const contactsFormContainer = ensureElement<HTMLFormElement>(
    ".form",
    contactsContainer,
  );
  currentForm = new FormContact(events, contactsFormContainer);
  modal.content = contactsFormContainer;
  modal.render();
  updateValidation();
});

events.on("contacts:submit", () => {
  const buyerInfo: IBuyer = buyerModal.getBuyer();
  const ItemsIds: string[] = [];
  basket.getProducts().forEach((items) => {
    ItemsIds.push(items.id);
  });

  const order: IOrder = Object.assign(buyerInfo, {
    total: basket.getTotalaPrice(),
    items: ItemsIds,
  });

  (async () => {
    try {
      const response = await server.createOrder(order);
      console.log("Заказ отправлен");
      console.log(response);
      const template = ensureElement<HTMLTemplateElement>("#success");
      if (!template) {
        throw new Error("Не найден шаблон");
      }
      const succesContainer = template.content.cloneNode(true) as HTMLElement;
      const ordersSucces = new SuccessOrder(events, succesContainer);
      ordersSucces.orderPrice = response.total;
      modal.content = succesContainer;
      modal.render();
      isOrderSucces = true;
      basket.clear();
      buyerModal.clear();
      isOrderSucces = false;
    } catch (error) {
      console.error("Ошибка при отправке заказа", error);
    }
  })();
});

events.on("success:close", () => {
  modal.modalISActive = false;
});

(async () => {
  try {
    const response = await server.getProductList();
    catalogModelWithApi.setProducts(response.items);

    console.log("Каталог загружен:", catalogModelWithApi.getProducts());
    response.items.forEach((item) => {
      console.log(item.image);
    });
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
})();
