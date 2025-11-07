import { IProduct } from '../../types'

export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    /**
     * Сохраняет массив товаров, полученный с сервера
     * @param products - массив объектов IProduct
     */
    public setProducts(products: IProduct[]): void {
        this.products = products;
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
     * @return IProduct
     */
    public setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    /**
     * Возвращает выбранный товар
     * @returns IProduct
     */
    public getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}