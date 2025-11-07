import './scss/styles.scss';
import { ProductCatalog } from "./components/models/ProductCatalog.ts";
import { apiProducts } from "./utils/data.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { API_URL } from "./utils/constants.ts";
import { ServerCommunication } from "./components/models/ServerCommunication.ts";
import { Api } from "./components/base/Api.ts";




const productsCatalogData = new ProductCatalog();
productsCatalogData.setProducts(apiProducts.items);

const allProducts = productsCatalogData.getProducts();

console.log('Вывод полученных товаров', productsCatalogData.getProducts());
console.log('Товар по ID', productsCatalogData.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

const selectedProduct = productsCatalogData.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390');

//Устанавливаем выбранный товар и добавляем проверку, что он точно есть
if (selectedProduct) {
    productsCatalogData.setSelectedProduct(selectedProduct);
} else {
    console.log('Товар не найден');
}

console.log('Вывод выбранного товара', productsCatalogData.getSelectedProduct());

const basketData = new Basket();

basketData.addItem(allProducts[0]);
basketData.addItem(allProducts[2]);
basketData.addItem(allProducts[3]);

console.log('Вывод всех товаров в корзине', basketData.getItems());
console.log('Вывод суммы товаров в корзине', basketData.getTotal());
console.log('Вывод количества товаров в корзине', basketData.getCount());
basketData.removeItem(allProducts[0]);
console.log('Вывод товаров после удаления одного товара', basketData.getItems());
basketData.clear();
console.log('Вывод товаров после очистки корзины', basketData.getItems());

const buyerData = new Buyer();

console.log('Выводим ошибки когда вообще нет данных покупателя', buyerData.validate());
buyerData.setField('address', 'address');
buyerData.setField('email', 'mail@mail.com');
console.log('Выводим ошибки когда незаполненны несколько полей', buyerData.validate());
buyerData.setField('payment', 'cash');
buyerData.setField('phone', 'phone');
console.log('Проверяем когда всё есть', buyerData.validate());
console.log('Выводим данные пользователя', buyerData.getData());
buyerData.clearData();
console.log('Выводим данные пользователя после очистки', buyerData.getData());



const api = new Api(API_URL);
const server = new ServerCommunication(api);
const catalogApi = new ProductCatalog();

server.loadProductList()
    .then(products => {
        catalogApi.setProducts(products);
        console.log('Каталог товаров с сервера:', catalogApi.getProducts());
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });
