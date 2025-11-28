import './scss/styles.scss';
import { ProductCatalog } from "./components/models/ProductCatalog.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { API_URL } from "./utils/constants.ts";
import { ServerCommunication } from "./components/models/ServerCommunication.ts";
import { Api } from "./components/base/Api.ts";
import { CatalogView } from './components/view/CatalogView';
import { IOrderRequest, IProduct } from "./types";
import { on } from "./utils/events.ts";
import { ensureElement } from "./utils/utils.ts";
import { CardDetail } from "./components/view/CardDetail.ts";
import { ICardDetailData } from "./types/view-cards.ts";
import { ModalView } from "./components/view/ModalView.ts";
import { CartView } from "./components/view/CartView.ts";
import { OrderFormView } from "./components/view/OrderFormView.ts";
import { ContactsFormView } from "./components/view/ContactsFormView.ts";
import { SuccessView } from "./components/view/SuccessView.ts";
import { CardCartItem } from "./components/view/CardCartItem.ts";
import { CardListItem } from "./components/view/CardListItem.ts";
import { HeaderView } from "./components/view/HeaderView.ts";

/* Презентер — набор обработчиков событий и экземпляры моделей/вью */

document.addEventListener('DOMContentLoaded', () => {
    const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
    const detailTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
    const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
    const cartItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
    const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    const successTemplate = ensureElement<HTMLTemplateElement>('#success');
    const rootCatalog = ensureElement<HTMLElement>('.gallery');

    const api = new Api(API_URL);
    const server = new ServerCommunication(api);

    // экземпляры моделей
    const catalog = new ProductCatalog();
    const basket = new Basket();
    const buyer = new Buyer();

    // экземпляры представлений
    const catalogView = new CatalogView(rootCatalog);
    const cartView = new CartView(cartTemplate);
    const modal = new ModalView();
    const headerView = new HeaderView();
    const orderForm = new OrderFormView(orderTemplate);
    const contactsForm = new ContactsFormView(contactsTemplate);
    const successView = new SuccessView(successTemplate);

    // функции презентера
    function updateBasketCounter(count: number) {
        headerView.setBasketCount(count);
    }

    function openDetail(id: string) {
        const product = catalog.getProductById(id);
        if (!product) return;

        catalog.setSelectedProduct(product);

        const inCart = basket.contains(product.id);
        const detailData: ICardDetailData = {
            ...product,
            inCart,
            buttonLabel: product.price === null
                ? 'Недоступно'
                : inCart ? 'Удалить из корзины' : 'Купить',
            buttonDisabled: product.price === null,
        };

        const detail = new CardDetail(detailTemplate);
        modal.open(detail.render(detailData));
    }

    function openCart() {
        // только открываем текущее состояние корзины
        modal.open(cartView.render());
    }

    // подписки на события
    on('catalog:item:select', ({ id }) => openDetail(id));
    on('detail:buy', ({ id }) => {
        const product = catalog.getProductById(id);
        if (product) {
            basket.addItem(product);
            modal.close();
        }
    });
    on('detail:remove', ({ id }) => {
        const product = catalog.getProductById(id);
        if (product) {
            basket.removeItem(product);
            updateBasketCounter(basket.getCount());
            modal.close();
        }
    });
    on('cart:item:remove', ({ id }) => {
        const product = catalog.getProductById(id);
        if (product) {
            basket.removeItem(product);
            updateBasketCounter(basket.getCount());
            openCart();
        }
    });

    // шаг 1: форма оплаты
    on('order:payment', ({ payment }) => buyer.setField('payment', payment));
    on('order:address', ({ address }) => buyer.setField('address', address));

    on('order:next', () => {
        modal.open(contactsForm.render(buyer.getData()));
    });

    // шаг 2: форма контактов
    on('contacts:email', ({ email }) => buyer.setField('email', email));
    on('contacts:phone', ({ phone }) => buyer.setField('phone', phone));

    // Событие изменение покупателя.
    on('buyer:changed', ({ errors }) => {
        orderForm.errors = Object.values(errors);
        contactsForm.errors = Object.values(errors);
    });

    // Отправка формы и очистка полей моделей и форм
    on('contacts:submit', async () => {
        const buyerData = buyer.getData();
        const order: IOrderRequest = {
            payment: buyerData.payment as 'card' | 'cash',
            email: buyerData.email,
            phone: buyerData.phone,
            address: buyerData.address,
            total: basket.getTotal(),
            items: basket.getItems().map(p => p.id)
        };
        try {
            await server.sendOrder(order);
            modal.open(successView.render({ total: basket.getTotal() }));
            buyer.clearData();
            basket.clear();
            updateBasketCounter(basket.getCount());
            // добавляем очистку форм
            contactsForm.clear();
            orderForm.clear();
        } catch (error) {
            console.error('Ошибка отправки заказа:', error);
        }
    });

    on('success:close', () => modal.close());

    on('cart:open', () => openCart());
    on('cart:checkout', () => {
        const buyerData = buyer.getData();
        modal.open(orderForm.render({
            payment: buyerData.payment as '' | 'card' | 'cash' | undefined,
            address: buyerData.address
        }));
    });

    // обработка события изменения каталога
    on('catalog:changed', ({ products }) => {
        const nodes = products.map((p: IProduct) => {
            const card = new CardListItem(catalogTemplate);
            return card.render({
                id: p.id,
                title: p.title,
                image: p.image,
                price: p.price,
                category: p.category,
            });
        });
        catalogView.render(nodes);
    });

    on('basket:changed', ({ items, total, count }) => {
        const nodes = items.map((p: IProduct, index: number) => {
            const card = new CardCartItem(cartItemTemplate);
            return card.render({
                id: p.id,
                title: p.title,
                price: p.price,
                index,
            });
        });
        cartView.items = nodes;
        cartView.total = total;
        headerView.setBasketCount(count);
    });

    // загрузка данных и инициализация
    server.loadProductList()
        .then((products: IProduct[]) => {
            catalog.setProducts(products); // только обновляем модель
            updateBasketCounter(basket.getCount());
        })
        .catch((error) => {
            console.error('Ошибка загрузки товаров:', error);
        });
});
