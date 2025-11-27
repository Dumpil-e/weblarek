import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IOrderFormData } from '../../types/view-forms.ts';
import { emit } from '../../utils/events';

export class ContactsFormView extends Component<IOrderFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private errorsEl: HTMLElement;

    private email: string = '';
    private phone: string = '';

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

        this.emailInput.addEventListener('input', () => {
            this.email = this.emailInput.value;
            emit('contacts:email', { email: this.email });
            this.validate();
        });

        this.phoneInput.addEventListener('input', () => {
            this.phone = this.phoneInput.value;
            emit('contacts:phone', { phone: this.phone });
            this.validate();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            emit('contacts:submit');
        });
    }

    private validate() {
        const errors: string[] = [];
        if (!this.email) errors.push('Укажите email');
        if (!this.phone) errors.push('Укажите телефон');
        this.errors = errors;
    }

    set errors(errors: string[]) {
        this.errorsEl.textContent = errors.join(', ');
        this.submitBtn.disabled = errors.length > 0;
    }

    clear() {
        this.email = '';
        this.phone = '';
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.errors = [];
    }
}
