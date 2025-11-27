import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { ISuccessData } from '../../types/view-forms.ts';
import { emit } from '../../utils/events';

export class SuccessView extends Component<ISuccessData> {
    private titleEl: HTMLElement;
    private descriptionEl: HTMLElement;
    private closeBtn: HTMLButtonElement;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.titleEl = ensureElement<HTMLElement>('.order-success__title', this.container);
        this.descriptionEl = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.closeBtn = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.closeBtn.addEventListener('click', () => emit('success:close'));
    }

    render(data: ISuccessData): HTMLElement {
        this.titleEl.textContent = 'Заказ оформлен';
        this.descriptionEl.textContent = `Списано ${data.total} синапсов`;
        return this.container;
    }
}
