import { Component } from '../base/Component.ts';

/**
 * Представление каталога товаров.
 * Отвечает только за вставку готовой коллекции карточек.
 * Не создаёт экземпляры других классов, чтобы избежать скрытой логики.
 */
export class CatalogView extends Component<HTMLElement[]> {
    constructor(root: HTMLElement) {
        super(root);
    }

    //принимает готовые узлы карточек
    render(nodes: HTMLElement[]): HTMLElement {
        this.container.replaceChildren(...nodes);
        return this.container;
    }
}
