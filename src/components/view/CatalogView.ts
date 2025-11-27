import { IProduct } from '../../types';
import { CardListItem } from './CardListItem';
import { Component } from '../base/Component.ts';

/**
 * Представление каталога товаров.
 * Отвечает за рендер списка карточек.
 */
export class CatalogView extends Component<IProduct[]> {
    constructor(private itemTemplate: HTMLTemplateElement, root: HTMLElement) {
        super(root);
    }

    render(products: IProduct[]): HTMLElement {
        const items = products.map((p) => {
            const card = new CardListItem(this.itemTemplate);
            return card.render({
                id: p.id,
                title: p.title,
                image: p.image,
                price: p.price,
                category: p.category,
            });
        });

        this.container.replaceChildren(...items);
        return this.container;
    }
}
