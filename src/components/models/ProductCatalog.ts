import { IProduct } from '../../types';
import {events} from "../../utils/events.ts";


export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    /**
     * Сохраняет массив товаров, полученный с сервера
     * и эмитит событие catalog:changed
     * @param products - массив объектов IProduct
     */
    public setProducts(products: IProduct[]): void {
        this.products = products;
        // emit('catalog:changed', { products: this.products }); // старая версия
        events.emit('catalog:changed', { products: this.products }); // новая версия
    }

    /**
     * Возвращает массив товаров из модели
     * @return массив IProduct[]
     */
    public getProducts(): IProduct[] {
        return this.products;
    }

    /**
     * Возвращает товар по его ID
     * @return IProduct
     */
    public getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    /**
     * Сохранение товара для его подробного отображения
     * и эмит события catalog:selected
     * @return IProduct
     */
    public setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        // emit('catalog:selected', { product }); // старая версия
        events.emit('catalog:selected', { product }); // новая версия
    }

    /**
     * Возвращает выбранный товар
     * @returns IProduct
     */
    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
