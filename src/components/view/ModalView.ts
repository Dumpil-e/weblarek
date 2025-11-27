import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { emit } from '../../utils/events';
import { IModalData } from '../../types/view-cards';

export class ModalView extends Component<IModalData> {
    private content: HTMLElement;
    private closeBtn: HTMLButtonElement;

    constructor() {
        const container = ensureElement<HTMLElement>('#modal-container');
        super(container);

        this.content = ensureElement<HTMLElement>('.modal__content', this.container);
        this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.container.classList.remove('modal_active');

        this.closeBtn.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    open(content: HTMLElement): void {
        this.content.replaceChildren(content);
        this.container.classList.add('modal_active');
        document.body.classList.add('modal-open');
        emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        document.body.classList.remove('modal-open');
        emit('modal:close');
    }
}
