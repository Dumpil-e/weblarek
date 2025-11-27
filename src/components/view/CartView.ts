import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ICardCartData } from '../../types/view-cards';
import { CardCartItem } from './CardCartItem';
import { emit } from '../../utils/events';

export class CartView extends Component<{ items: ICardCartData[]; total: number }> {
    private listEl: HTMLElement;
    private totalEl: HTMLElement;
    private checkoutBtn: HTMLButtonElement;
    private itemTemplate: HTMLTemplateElement;

    constructor(template: HTMLTemplateElement, itemTemplate: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.itemTemplate = itemTemplate;
        this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);
        this.checkoutBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // событие на кнопку "Оформить"
        this.checkoutBtn.addEventListener('click', () => {
            emit('cart:checkout');
        });
    }

    set total(value: number) {
        this.totalEl.textContent = `${value} синапсов`;
    }

    set canCheckout(value: boolean) {
        this.checkoutBtn.disabled = !value;
    }

    render(data: { items: ICardCartData[]; total: number }): HTMLElement {
        const nodes = data.items.map((item) => {
            const card = new CardCartItem(this.itemTemplate);
            return card.render(item);
        });

        this.listEl.replaceChildren(...nodes);
        this.total = data.total;
        this.canCheckout = data.items.length > 0;

        return this.container;
    }
}
