import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IBaseCardData } from '../../types/view-cards';

export abstract class BaseCard extends Component<IBaseCardData> {
    protected titleEl: HTMLElement;
    protected priceEl: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceEl = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.titleEl.textContent = value;
    }

    set price(value: number | null) {
        this.priceEl.textContent = value !== null ? `${value} синапсов` : 'Бесценно';
    }

    render(data: IBaseCardData): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.price = data.price;
        return this.container;
    }
}
