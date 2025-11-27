import './scss/styles.scss';
import { ProductCatalog } from "./components/models/ProductCatalog.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { API_URL } from "./utils/constants.ts";
import { ServerCommunication } from "./components/models/ServerCommunication.ts";
import { Api } from "./components/base/Api.ts";
import { CatalogView } from './components/view/CatalogView'
import { IProduct} from "./types";
import { on } from "./utils/events.ts";
import { ensureElement } from "./utils/utils.ts";
import { CardDetail } from "./components/view/CardDetail.ts";
import { ICardCartData, ICardDetailData } from "./types/view-cards.ts";
import { ModalView } from "./components/view/ModalView.ts";
import { CartView } from "./components/view/CartView.ts";
import {OrderFormView} from "./components/view/OrderFormView.ts";
import {ContactsFormView} from "./components/view/ContactsFormView.ts";
import {SuccessView} from "./components/view/SuccessView.ts";

/* Код презентера */

// Презентер — связывает модель и представления

class AppPresenter {
    private catalog = new ProductCatalog();
    private basket = new Basket();
    private buyer = new Buyer();

    private catalogView: CatalogView;
    private cartView: CartView;
    private modal = new ModalView();

    private detailTemplate: HTMLTemplateElement;
    private orderForm: OrderFormView;
    private contactsForm: ContactsFormView;
    private successView: SuccessView;

    constructor(
        catalogTemplate: HTMLTemplateElement,
        detailTemplate: HTMLTemplateElement,
        cartTemplate: HTMLTemplateElement,
        cartItemTemplate: HTMLTemplateElement,
        orderTemplate: HTMLTemplateElement,
        contactsTemplate: HTMLTemplateElement,
        successTemplate: HTMLTemplateElement,
        rootCatalog: HTMLElement
    ) {
        this.catalogView = new CatalogView(catalogTemplate, rootCatalog);
        this.detailTemplate = detailTemplate;
        this.cartView = new CartView(cartTemplate, cartItemTemplate);
        this.orderForm = new OrderFormView(orderTemplate);
        this.contactsForm = new ContactsFormView(contactsTemplate);
        this.successView = new SuccessView(successTemplate);

        // выбор товара
        on('catalog:item:select', ({ id }) => this.openDetail(id));

        // покупка
        on('detail:buy', ({ id }) => {
            const product = this.catalog.getProductById(id);
            if (product) {
                this.basket.addItem(product);
                this.updateBasketCounter();
                this.modal.close();
            }
        });

        // удаление
        on('detail:remove', ({ id }) => {
            const product = this.catalog.getProductById(id);
            if (product) {
                this.basket.removeItem(product);
                this.updateBasketCounter();
                this.modal.close();
            }
        });

        // удаление из корзины
        on('cart:item:remove', ({ id }) => {
            const product = this.catalog.getProductById(id);
            if (product) {
                this.basket.removeItem(product);
                this.updateBasketCounter();
                this.openCart();
            }
        });

        // шаг 1: форма оплаты
        on('order:payment', ({ payment }) => this.buyer.setField('payment', payment));
        on('order:address', ({ address }) => this.buyer.setField('address', address));
        on('order:next', () => {
            const errors = this.buyer.validate();
            if (errors.payment || errors.address) {
                this.orderForm.errors = Object.values(errors);
            } else {
                this.modal.open(this.contactsForm.render({ email: '', phone: '' }));
            }
        });

        // шаг 2: форма контактов
        on('contacts:email', ({ email }) => this.buyer.setField('email', email));
        on('contacts:phone', ({ phone }) => this.buyer.setField('phone', phone));
        on('contacts:submit', () => {
            const errors = this.buyer.validate();
            if (errors.email || errors.phone) {
                this.contactsForm.errors = Object.values(errors);
            } else {
                this.modal.open(this.successView.render({ total: this.basket.getTotal() }));
                this.buyer.clearData();
                this.basket.clear();
                this.updateBasketCounter();
                this.orderForm.clear();
                this.contactsForm.clear();
            }
        });

        // success close
        on('success:close', () => this.modal.close());

        // кнопка открытия корзины
        const basketBtn = ensureElement<HTMLButtonElement>('.header__basket');
        basketBtn.addEventListener('click', () => this.openCart());

        // событие checkout из CartView
        on('cart:checkout', () => {
            this.modal.open(this.orderForm.render({ payment: '', address: '' }));
        });
    }

    init(products: IProduct[]): void {
        this.catalog.setProducts(products);
        this.catalogView.render(this.catalog.getProducts());
        this.updateBasketCounter();
    }

    private openDetail(id: string): void {
        const product = this.catalog.getProductById(id);
        if (!product) return;

        this.catalog.setSelectedProduct(product);

        const inCart = this.basket.contains(product.id);
        const detailData: ICardDetailData = {
            ...product,
            inCart,
            buttonLabel: product.price === null
                ? 'Недоступно'
                : inCart ? 'Удалить из корзины' : 'Купить',
            buttonDisabled: product.price === null,
        };

        const detail = new CardDetail(this.detailTemplate);
        const detailNode = detail.render(detailData);
        this.modal.open(detailNode);
    }

    private openCart(): void {
        const items: ICardCartData[] = this.basket.getItems().map((p, index) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            index,
        }));

        const cartNode = this.cartView.render({ items, total: this.basket.getTotal() });
        this.modal.open(cartNode);
    }

    private updateBasketCounter(): void {
        const counter = ensureElement<HTMLElement>('.header__basket-counter');
        counter.textContent = String(this.basket.getCount());
    }
}

// ------------------
// Точка входа main.ts
// ------------------
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

    server.loadProductList()
        .then((products: IProduct[]) => {
            const app = new AppPresenter(
                catalogTemplate,
                detailTemplate,
                cartTemplate,
                cartItemTemplate,
                orderTemplate,
                contactsTemplate,
                successTemplate,
                rootCatalog
            );
            app.init(products);
        })
        .catch((error) => {
            console.error('Ошибка загрузки товаров:', error);
        });
});