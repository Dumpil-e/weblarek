import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ICardCartData } from '../../types/view-cards';
import {events} from "../../utils/events.ts";


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

        this.checkoutBtn.addEventListener('click', () => {
            // emit('cart:checkout'); // старая версия
            events.emit('cart:checkout'); // новая версия
        });
    }

    set items(nodes: HTMLElement[]) {
        this.listEl.replaceChildren(...nodes);
        this.canCheckout = nodes.length > 0;
    }

    set total(value: number) {
        this.totalEl.textContent = `${value} синапсов`;
    }

    set canCheckout(value: boolean) {
        this.checkoutBtn.disabled = !value;
    }

    render(): HTMLElement {
        return this.container;
    }
}
