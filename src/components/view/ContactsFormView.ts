import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IOrderFormData } from '../../types/view-forms.ts';
import { emit } from '../../utils/events';

/**
 * Представление формы контактов.
 * Отвечает только за отображение полей и ошибок.
 * Не выполняет валидацию — ошибки приходят от модели через презентер.
 */
export class ContactsFormView extends Component<IOrderFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private errorsEl: HTMLElement;

    constructor(template: HTMLTemplateElement) {
        const root = cloneTemplate<HTMLElement>(template);
        super(root);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
        this.submitBtn = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsEl = ensureElement<HTMLElement>('.form__errors', this.container);

        this.emailInput.addEventListener('input', () => {
            emit('contacts:email', { email: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            emit('contacts:phone', { phone: this.phoneInput.value });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            emit('contacts:submit');
        });
    }

    // Метод для отображения ошибок, вызывается презентером
    set errors(errors: string[]) {
        this.errorsEl.textContent = errors.join(', ');
        this.submitBtn.disabled = errors.length > 0;
    }

    clear() {
        this.emailInput.value = '';
        this.phoneInput.value = '';
        this.errors = [];
    }
}
