import { cloneTemplate, ensureElement } from '../../utils/utils';
import { BaseCard } from './BaseCard';
import { ICardDetailData } from '../../types/view-cards';

import { CDN_URL, categoryMap } from '../../utils/constants';
import {events} from "../../utils/events.ts";

// создаём локальный экземпляр эмитера


export class CardDetail extends BaseCard {
    private actionBtn: HTMLButtonElement;
    private imageEl: HTMLImageElement;
    private categoryEl: HTMLElement;
    private textEl: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.actionBtn = ensureElement<HTMLButtonElement>('.card__button', this.container);
        this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
        this.textEl = ensureElement<HTMLElement>('.card__text', this.container);

        this.actionBtn.addEventListener('click', () => {
            const id = this.container.dataset.id!;
            const label = this.actionBtn.textContent?.trim();
            // if (label === 'Купить') emit('detail:buy', { id }); // старая версия
            // else if (label === 'Удалить из корзины') emit('detail:remove', { id }); // старая версия

            if (label === 'Купить') {
                events.emit('detail:buy', { id }); // новая версия
            } else if (label === 'Удалить из корзины') {
                events.emit('detail:remove', { id }); // новая версия
            }
        });
    }

    set image(src: string) {
        this.setImage(this.imageEl, `${CDN_URL}/${src}`, this.titleEl.textContent || '');
    }

    set category(value: string) {
        const modifier = categoryMap[value as keyof typeof categoryMap] ?? '';
        this.categoryEl.className = `card__category ${modifier}`;
        this.categoryEl.textContent = value;
    }

    set description(value: string) {
        this.textEl.textContent = value;
    }

    set buttonLabel(value: ICardDetailData['buttonLabel']) {
        this.actionBtn.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.actionBtn.disabled = value;
    }

    render(data: ICardDetailData): HTMLElement {
        super.render(data);
        this.image = data.image;
        this.category = data.category;
        this.description = data.description;
        this.buttonLabel = data.buttonLabel;
        this.buttonDisabled = data.buttonDisabled;
        return this.container;
    }
}
