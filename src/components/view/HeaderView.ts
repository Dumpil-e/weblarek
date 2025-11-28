// components/view/HeaderView.ts
import { ensureElement } from '../../utils/utils';
import { emit } from '../../utils/events';

export class HeaderView {
    private basketBtn: HTMLButtonElement;
    private basketCounter: HTMLElement;

    constructor() {
        this.basketBtn = ensureElement<HTMLButtonElement>('.header__basket');
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

        this.basketBtn.addEventListener('click', () => {
            emit('cart:open');
        });
    }

    // Обновляет визуальный счетчик корзины
    public setBasketCount(count: number): void {
        this.basketCounter.textContent = String(count);
    }
}
