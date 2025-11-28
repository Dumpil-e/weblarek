import { cloneTemplate, ensureElement } from '../../utils/utils';
import { BaseCard } from './BaseCard';
import { ICardCartData } from '../../types/view-cards';
import {events} from "../../utils/events.ts";


export class CardCartItem extends BaseCard {
    private removeBtn: HTMLButtonElement;
    private indexEl: HTMLElement | null;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.removeBtn = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.indexEl = this.container.querySelector('.basket__item-index');

        this.removeBtn.addEventListener('click', () => {
            const id = this.container.dataset.id!;
            // emit('cart:item:remove', { id }); // старая версия
            events.emit('cart:item:remove', { id }); // новая версия
        });
    }

    set index(value: number) {
        if (this.indexEl) this.indexEl.textContent = String(value + 1);
    }

    render(data: ICardCartData): HTMLElement {
        super.render(data);
        this.index = data.index;
        return this.container;
    }
}