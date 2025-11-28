import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IOrderFormData } from '../../types/view-forms.ts';
import {events} from "../../utils/events.ts";


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
            // emit('contacts:email', { email: this.emailInput.value }); // старая версия
            events.emit('contacts:email', { email: this.emailInput.value }); // новая версия
        });

        this.phoneInput.addEventListener('input', () => {
            // emit('contacts:phone', { phone: this.phoneInput.value }); // старая версия
            events.emit('contacts:phone', { phone: this.phoneInput.value }); // новая версия
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            // emit('contacts:submit'); // старая версия
            events.emit('contacts:submit'); // новая версия
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
