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
import { cloneTemplate, ensureElement } from "./utils/utils";
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
import { IOrder } from "./types/index";
import { CDN_URL } from "./utils/constants";

const galerryContainer = ensureElement<HTMLElement>(".gallery");
const modalsContainer = ensureElement<HTMLElement>("#modal-container");
const headerContainer = ensureElement<HTMLElement>(".header");
const CardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const BasketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basketContainer = BasketTemplate.content.cloneNode(true) as HTMLElement;
const CardPrewiewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const CardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const OrderTemplate = ensureElement<HTMLTemplateElement>("#order");
const ordersContainer = OrderTemplate.content.cloneNode(true) as HTMLElement;
const orderFormContainer = ensureElement<HTMLFormElement>(
    ".form",
    ordersContainer,
);  
const ContactTemplate = ensureElement<HTMLTemplateElement>("#contacts");
  
  const contactsContainer = ContactTemplate.content.cloneNode(true) as HTMLElement;
  const contactsFormContainer = ensureElement<HTMLFormElement>(
    ".form",
    contactsContainer,
  );
 const SuccesTemplate = ensureElement<HTMLTemplateElement>("#success");
      const succesContainer = SuccesTemplate.content.cloneNode(true) as HTMLElement;
const cardPrewiewContainer = CardPrewiewTemplate.content.cloneNode(
        true,
      ) as HTMLElement;


const api = new Api(API_URL);
const server = new LarekApi(api);
const events = new EventEmitter();
const catalogModelWithApi = new Catalog(events);
const gallery = new Gallery(galerryContainer);
const modal = new Modal(events, modalsContainer);
const basket = new Basket(events);
const header = new Header(events, headerContainer);
const buyerModal = new Buyer(events);
const basketView = new BasketForModal(events, basketContainer); 
const formOrder = new FormOrder(events, orderFormContainer);
const formContact = new FormContact(events, contactsFormContainer);
const ordersSucces = new SuccessOrder(events, succesContainer);
const cardPrewiew = new CardByModal(events, cardPrewiewContainer);

events.on("catalog:products-updated", () => {
  const productsCard = catalogModelWithApi.getProducts().map((product: IProduct) => {
    const cardByCatalog = new CardByCatalog(cloneTemplate(CardCatalogTemplate), {
      onClick: () => events.emit('card:selected', product)
    })
    cardByCatalog.image = {
      image: product.image,
      alt: `${product.title} — ${product.category}`,
    };
    cardByCatalog.category = product.category;
    cardByCatalog.title = product.title;
    cardByCatalog.price = product.price;
    return cardByCatalog.render();
  });
  gallery.render( {catalog: productsCard});
  });
    
events.on("card:selected", (product: IProduct) => {
  if (!product) {
    return;
  }
  catalogModelWithApi.setSelectedProduct(product);
});

events.on(
  "catalog:selected-product-changed",
  ({ product }: { product: IProduct | null }) => {
    if (!product) {
      modal.close();
    } else {
      modal.open();
      cardPrewiew.category = product.category;
      cardPrewiew.description = product.description;
      cardPrewiew.image = {
        image: product.image,
        alt: `${product.title} — ${product.category}`,
      };
      cardPrewiew.title = product.title;
      cardPrewiew.price = product.price;

      const isInBusket = basket.hasProductById(product.id);
      if (isInBusket) {
        cardPrewiew.buttonText = "Удалить из корзины";
      } else {
        if (product.price === null) {
          cardPrewiew.buttonText = "Недоступно";
          cardPrewiew.isDisabled = true;
        } else {
          cardPrewiew.buttonText = "Купить";
        }
      }
      modal.content = cardPrewiew.render()
    }
  },
);


events.on("cardbutton: clicked", () => {
  const product = catalogModelWithApi.getSelectedProduct();
  if (!product) return;
  const isInBasket = basket.hasProductById(product.id);
  if (isInBasket) {
    basket.deleteProduct(product);
  } else {
    basket.addProduct(product);
  }
  modal.close();
});


events.on("basket:open", () => {
  if (basket.getProducts().length === 0) {
    basketView.buttonIsActive = false;
  };
  modal.content = basketView.render();
  modal.open();
});

events.on("basket:changed", () => {
  header.counter = basket.getCount();
  const basketList = basket.getProducts()
  const cardsBasketList = basketList.map((item: IProduct) => {
    const cardBasket = new CardByBasket(cloneTemplate(CardBasketTemplate), {
      onDelete: () => {
        events.emit('basketItem:delete', item)
      }
    })
    cardBasket.title = item.title;
    cardBasket.price = item.price;
    cardBasket.index = basketList.indexOf(item) + 1;
    return cardBasket.render()
  })
    if (basketList.length === 0) {
    basketView.buttonIsActive = false;
    
  };
    basketView.price = basket.getTotalaPrice();
    basketView.list = cardsBasketList;
    
});

events.on("basketItem:delete", (item: IProduct) => {
  if (!item) {
    return;
  }
  basket.deleteProduct(item);
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

events.on("card:ischecked", () => {
  buyerModal.setPayment("card");
});

events.on("cash:ischecked", () => {
  buyerModal.setPayment("cash");
});

events.on("order:make", () => {
  modal.content = formOrder.render();
  modal.render();
});

events.on("buyer:changed", (data: { field: keyof IBuyer }) => {
  const errors = buyerModal.validate();
  //const {payment, address, email, phone} = buyerModal.validate();
  if (!data || ['payment', 'address'].includes(data.field)) {
    formOrder.address = buyerModal.getBuyer().address;
    formOrder.paymentTypeActive = buyerModal.getBuyer().payment;
    const orderErrors = ['payment', 'address']
    .filter(key => errors[key] !== undefined)
    .map(key => errors[key]!);
    const errorMessages = orderErrors.length > 0 ? orderErrors.join('; ') : '';
    formOrder.formserrors = errorMessages;
    formOrder.valid = errorMessages.length === 0;
    //formOrder.render()
  }
  if (!data || ['email', 'phone'].includes(data.field)) {
    formContact.email = buyerModal.getBuyer().email;
    formContact.phone = buyerModal.getBuyer().phone;
    const contactErrors = ['email', 'phone']
    .filter(key => errors[key] !== undefined)
    .map(key => errors[key]!);
    const errorMessages = contactErrors.length > 0 ? contactErrors.join('; ') : '';
    formContact.formserrors = errorMessages;
    formContact.valid = errorMessages.length === 0;
    //formContact.render()
  }
});


events.on("order:submit", () => { 
  modal.content = formContact.render();
  modal.render();
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
      ordersSucces.orderPrice = response.total;
      modal.content = ordersSucces.render();
      modal.render();
      basket.clear();
      buyerModal.clear();
    } catch (error) {
      console.error("Ошибка при отправке заказа", error);
    }
  })();
});

events.on("success:close", () => {
  modal.close()
});

(async () => {
  try {
    const response = await server.getProductList();
    const fixedItems = response.items.map((item: IProduct) => ({
      ...item,
      image: item.image ? CDN_URL + item.image : '/no-image.png', // защита от undefined
    }));
    catalogModelWithApi.setProducts(fixedItems);
    console.log("Каталог загружен:", catalogModelWithApi.getProducts());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
})();
