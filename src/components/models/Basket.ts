import { IProduct } from '../../types'

export class Basket {
    /**
     * Массив товаров добавленных в корзину
     * @type IProduct[]
     */
    private items: IProduct[] = [];

    /**
     * Возвращает массив товаров в корзине
     * @returns IProduct[]
     */
    public getItems(): IProduct[] {
        return this.items;
    }

    /**
     * Добавляет товар в корзину
     * @param product {IProduct}
     */
    public addItem(product: IProduct): void {
        this.items.push(product);
    }

    /**
     * Удаляет товар из корзины полученный в параметре
     * @param product {IProduct}
     */
    public removeItem(product: IProduct): void {
        this.items = this.items.filter(item => item.id !== product.id)
    }

    /**
     * Удаляет все товары из корзины
     */
    public clear(): void {
        this.items = [];
    }

    /**
     * Возвращает сумму всех товаров в корзине
     * @returns number
     */
    public getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0)
    }

    /**
     * Возвращает количество товаров в корзине
     */
    public getCount(): number {
        return this.items.length;
    }

    /**
     * Проверяет есть ли товар в корзине
     * @param id
     * @returns boolean
     */
    public contains(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}