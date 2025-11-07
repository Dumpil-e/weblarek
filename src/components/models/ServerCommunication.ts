import { IApi, IProductListResponse, IOrderRequest, IProduct } from '../../types';

export class ServerCommunication {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    /**
     * Получает массив товаров с сервера
     * @returns Promise<IProduct[]>
     */
    public async loadProductList(): Promise<IProduct[]> {
        const response = await this.api.get<IProductListResponse>('/product/');
        return response.items;
    }

    /**
     * Отправляет заказ на сервер
     * @param order - объект заказа
     * @returns Promise<void>
     */
    public async sendOrder(order: IOrderRequest): Promise<void> {
        await this.api.post('/order/', order, 'POST');
    }
}