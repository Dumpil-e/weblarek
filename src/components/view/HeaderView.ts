import { ensureElement } from '../../utils/utils';
import {events} from "../../utils/events.ts";


export class HeaderView {
    private basketBtn: HTMLButtonElement;
    private basketCounter: HTMLElement;

    constructor() {
        this.basketBtn = ensureElement<HTMLButtonElement>('.header__basket');
        this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

        this.basketBtn.addEventListener('click', () => {
            // emit('cart:open'); // старая версия
            events.emit('cart:open'); // новая версия
        });
    }

    public setBasketCount(count: number): void {
        this.basketCounter.textContent = String(count);
    }
}
