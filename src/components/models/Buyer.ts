import {emit} from "../../utils/events.ts";

export class Buyer {
    private payment: string = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    /**
     * Заполняет поле покупателя
     * @param field
     * @param value
     * Эмитит событие обновления покупателя
     */
    public setField(field: 'payment' | 'address' | 'phone' | 'email', value: string) {
        this[field] = value;
        const errors = this.validate();
        emit('buyer:changed', {
            data: this.getData(),
            errors
        });
    }

    /**
     * Возвращает массив с данными покупателя
     * @returns {payment: string, address: string, phone: string, email: string}
     */

    public getData(): {
        payment: string;
        address: string;
        phone: string;
        email: string
    } {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        }
    }

    /**
     * Очищает данные покупателя
     * Этимит событие обновления покупателя
     */
    public clearData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
        emit('buyer:changed', {
            data: this.getData(),
            errors: this.validate()
        });
    }

    /**
     * Проверяет заполненны ли поля Покупателя. Возвращает объект ошибок
     * @returns {{payment?: string, address?: string, phone?: string, email?: string}}
     */
    public validate(): {
        payment?: string;
        address?: string;
        phone?: string;
        email?: string;
    } { const errors: {
        payment?: string;
        address?: string;
        phone?: string;
        email?: string;
    } = {};

        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address) errors.address = 'Укажите адрес';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.email) errors.email = 'Укажите емэйл';

        return errors;
    }
}