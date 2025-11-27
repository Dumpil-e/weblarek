# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

# Данные
## Интерфейсы
 Описание товара:
```js
interface IProduct {
    id: string; // уникальный идентификатор
    title: string; // имя товара
    description: string; // Описание товара
    image: string; // путь к изображению товара
    category: string; // категория товара
    price: number | null; // цена товара (может быть не указана)
}
```
Описание покупателя:
```js
interface IBuyer {
    email: string; // почта покупателя
    phone: string; // телефон покупателя
    payment: 'card' | 'cash' | ''; // способ оплаты с формы
    address: string; // адрес заказа
}
```

## Модели данных

### Класс каталога товаров
```js
class ProductCatalog {
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
```

### Класс корзины

Отвечает за хранение и управление товарами для покупки
```js
class Basket {
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
```
## Класс покупатель
Хранит данные покупателя. Имеет методы валидации и заполнения полей
```js
class Buyer {
    private payment: string = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    /**
     * Заполняет поле покупателя
     * @param field
     * @param value
     */
    public setField(field: 'payment' | 'address' | 'phone' | 'email', value: string) {
        this[field] = value;        
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
     */
    public clearData(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';
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
```

# Слой коммуникации

```js
class ServerCommunication {
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
```

# Слой представления (View)

## Родительский класс карточек BaseCard

Интерфейс наследуется от IProduct и оставляет только данные присутствующие во всех карточках
```ts
export interface IBaseCardData extends Pick<IProduct, 'id' | 'title' | 'price'> {}
```


```ts
/**
 * Родительский класс для всех карточек.
 * Общий функционал:
 * - хранение id во внутреннем поле
 * - отображение заголовка и цены
 * - хранение id в dataset
 */
export abstract class BaseCard<T extends IBaseCardData> extends Component<T> {
    protected titleEl: HTMLElement;
    protected priceEl: HTMLElement;

    render() {
        
    }

    /** Установка id товара */
    set id(value: string)

    /** Установка названия товара */
    set title(value: string)
    
    /** Установка цены*/
    set price(value: number | null)

}
```
## Карточка каталога (Список товаров)

```ts
/**
 * Карточка товара в каталоге.
 * Отображает картинку, название, цену, категорию.
 * Генерирует событие выбора товара (по клику).
 */
export class CardListItem extends BaseCard {
    private imageEl: HTMLImageElement;
    private categoryEl: HTMLElement;

    /** Утсанавливает изображение товара*/
    set image(src: string)

    /** Установка категории товара*/
    set category(value: string)

    render() {
        return this.conteiner;
    }
```

## Карточка товара внутри модального окна (детальное отображение)

```ts
/**
 * Карточка товара в модальном окне.
 * Отображает картинку, описание, кнопку действия.
 * Генерирует событие при клике удалить или купить.
 */
export class CardDetail extends BaseCard {
    private actionBtn: HTMLButtonElement;
    private imageEl: HTMLImageElement;
    private categoryEl: HTMLElement;
    private textEl: HTMLElement;
}
```

## Карточка товара внутри корзины

```ts
/*
* Генерируте событи удаления товара из корзины
* cart:item:remove
* */
export class CardCartItem extends BaseCard {
    private removeBtn: HTMLButtonElement;
    private indexEl: HTMLElement | null;
}
```

## Построение списка карточек в каталоге

```ts
/**
 * Представление каталога товаров.
 * Отвечает за рендер списка карточек.
 */
export class CatalogView extends Component<IProduct[]>
```

## Класс модального окна

```ts
/** Имеет события открытия и закрытия*/
export class ModalView extends Component<IModalData> {
    private content: HTMLElement;
    private closeBtn: HTMLButtonElement;
}
```

## Классы форм заказа 

```ts
/* Открыти формы заполнения почты и телефона. События передачи данных и валидация* /
export class ContactsFormView extends Component<IOrderFormData> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private errorsEl: HTMLElement;

    private email: string = '';
    private phone: string = '';
}
```

```ts
/* Открывает форму ввода адреса и выбора оплаты. Выбор оплаты и адреса, событие открытия следующей формы и валидация. */
export class OrderFormView extends Component<IPaymentFormData> {
    private cardBtn: HTMLButtonElement;
    private cashBtn: HTMLButtonElement;
    private addressInput: HTMLInputElement;
    private submitBtn: HTMLButtonElement;
    private errorsEl: HTMLElement;

    private payment: string = '';
    private address: string = '';
```

```ts
/* форма подтвержения заказа. Событие закрытия*/
export class SuccessView extends Component<ISuccessData> {
    private titleEl: HTMLElement;
    private descriptionEl: HTMLElement;
    private closeBtn: HTMLButtonElement;
```

# Презентер


```ts
/* Главный презентер приложения.
   Управляет логикой работы страницы, связывает модели и представления.
   Обрабатывает все события, генерируемые моделями и вью:

   События от представлений:
   - catalog:item:select — выбор карточки товара для просмотра;
   - detail:buy — покупка товара из модалки;
   - detail:remove — удаление товара из корзины из модалки;
   - cart:item:remove — удаление товара из корзины в списке корзины;
   - cart:checkout — нажатие кнопки оформления заказа в корзине;
   - order:payment — выбор способа оплаты;
   - order:address — ввод адреса доставки;
   - order:next — переход ко второй форме (валидация и открытие формы контактов);
   - contacts:email — ввод email;
   - contacts:phone — ввод телефона;
   - contacts:submit — отправка формы контактов (валидация и открытие success-экрана);
   - success:close — закрытие окна успешного заказа;
   - click по .header__basket — открытие корзины.

*/
export class AppPresenter {
    private catalog = new ProductCatalog();
    private basket = new Basket();
    private buyer = new Buyer();

    private catalogView: CatalogView;
    private cartView: CartView;
    private modal = new ModalView();

    private detailTemplate: HTMLTemplateElement;
    private orderForm: OrderFormView;
    private contactsForm: ContactsFormView;
    private successView: SuccessView;
}
```