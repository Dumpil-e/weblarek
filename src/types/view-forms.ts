import { IBuyer } from "./index.ts";

/* Данные для формы заказа */
export interface IOrderFormData extends Pick<IBuyer, 'email' | 'phone'> {}

/* Данные для формы оплаты */
export interface IPaymentFormData extends Pick<IBuyer, 'payment' | 'address'> {}

export interface ISuccessData {
    total: number;
}