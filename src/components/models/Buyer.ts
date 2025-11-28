import {events} from "../../utils/events.ts";


export class Buyer {
    private payment: string = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    public setField(field: 'payment' | 'address' | 'phone' | 'email', value: string) {
        this[field] = value;
        const errors = this.validate();
        // emit('buyer:changed', { data: this.getData(), errors }); // старая версия
        events.emit('buyer:changed', { data: this.getData(), errors }); // новая версия
    }

    public getData(): { payment: string; address: string; phone: string; email: string } {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }

    public clearData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
        // emit('buyer:changed', { data: this.getData(), errors: this.validate() }); // старая версия
        events.emit('buyer:changed', { data: this.getData(), errors: this.validate() }); // новая версия
    }

    public validate(): { payment?: string; address?: string; phone?: string; email?: string } {
        const errors: { payment?: string; address?: string; phone?: string; email?: string } = {};

        if (!this.payment) errors.payment = 'Не выбран вид оплаты';
        if (!this.address) errors.address = 'Укажите адрес';
        if (!this.phone) errors.phone = 'Укажите телефон';
        if (!this.email) errors.email = 'Укажите емэйл';

        return errors;
    }
}
