import { cloneTemplate, ensureElement } from '../../utils/utils';
import { BaseCard } from './BaseCard';
import { ICardListData } from '../../types/view-cards';
import { CDN_URL, categoryMap } from '../../utils/constants';
import { emit } from '../../utils/events';

export class CardListItem extends BaseCard {
    private imageEl: HTMLImageElement;
    private categoryEl: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);
        this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);

        this.container.addEventListener('click', () => {
            const id = this.container.dataset.id;
            if (id) emit('catalog:item:select', { id });
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

    render(data: ICardListData): HTMLElement {
        super.render(data);
        this.image = data.image;
        this.category = data.category;
        return this.container;
    }
}
