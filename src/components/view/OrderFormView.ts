import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IPaymentFormData } from '../../types/view-forms.ts';
import {events} from "../../utils/events.ts";


export class OrderFormView extends Component<IPaymentFormData> {
    private cardBtn: HTMLButtonElement;
    private cashBtn: HTMLButtonElement;
    private addressInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private errorsEl: HTMLElement;

    private payment: string = '';
    private address: string = '';

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.cardBtn = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashBtn = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.submitBtn = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

        this.cardBtn.addEventListener('click', () => this.selectPayment('card'));
        this.cashBtn.addEventListener('click', () => this.selectPayment('cash'));
        this.addressInput.addEventListener('input', () => {
            this.address = this.addressInput.value;
            // emit('order:address', { address: this.address }); // старая версия
            events.emit('order:address', { address: this.address }); // новая версия
            this.validate();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            // emit('order:next'); // старая версия
            events.emit('order:next'); // новая версия
        });
    }

    private selectPayment(type: 'card' | 'cash') {
        this.cardBtn.classList.remove('button_alt-active');
        this.cashBtn.classList.remove('button_alt-active');

        if (type === 'card') {
            this.cardBtn.classList.add('button_alt-active');
        } else {
            this.cashBtn.classList.add('button_alt-active');
        }

        this.payment = type;
        // emit('order:payment', { payment: type }); // старая версия
        events.emit('order:payment', { payment: type }); // новая версия
        this.validate();
    }

    private validate() {
        const errors: string[] = [];
        if (!this.payment) errors.push('Не выбран способ оплаты');
        if (!this.address) errors.push('Укажите адрес');
        this.errors = errors;
    }

    set errors(errors: string[]) {
        this.errorsEl.textContent = errors.join(', ');
        this.submitBtn.disabled = errors.length > 0;
    }

    clear() {
        this.payment = '';
        this.address = '';
        this.addressInput.value = '';
        this.cardBtn.classList.remove('button_alt-active');
        this.cashBtn.classList.remove('button_alt-active');

        // сбрасываем ошибки и делаем кнопку "Далее" неактивной
        this.errorsEl.textContent = '';
        this.submitBtn.disabled = true;
    }
}
