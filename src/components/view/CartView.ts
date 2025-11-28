import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ICardCartData } from '../../types/view-cards';
import { emit } from '../../utils/events';

export class CartView extends Component<{ items: ICardCartData[]; total: number }> {
    private listEl: HTMLElement;
    private totalEl: HTMLElement;
    private checkoutBtn: HTMLButtonElement;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.listEl = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalEl = ensureElement<HTMLElement>('.basket__price', this.container);
        this.checkoutBtn = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        // событие на кнопку "Оформить"
        this.checkoutBtn.addEventListener('click', () => {
            emit('cart:checkout');
        });
    }

    //принимает готовую разметку списка покупок
    set items(nodes: HTMLElement[]) {
        this.listEl.replaceChildren(...nodes);
        this.canCheckout = nodes.length > 0;
    }

    //обновляет стоимость
    set total(value: number) {
        this.totalEl.textContent = `${value} синапсов`;
    }

    set canCheckout(value: boolean) {
        this.checkoutBtn.disabled = !value;
    }

    //Метод render теперь только возвращает контейнер
    render(): HTMLElement {
        return this.container;
    }
}
