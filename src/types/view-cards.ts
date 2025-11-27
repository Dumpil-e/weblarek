import { IProduct} from "./index.ts";

/** Базовые данные для карточки */
export interface IBaseCardData extends Pick<IProduct, 'id' | 'title' | 'price'> {}

/** Данные для карточки католога */
export interface ICardListData extends Pick<IProduct, 'id' | 'title' | 'image' | 'price' | 'category'> {}

/** Данные карточки открытой в модальном окне*/
export interface ICardDetailData extends IProduct {
    inCart: boolean;
    buttonLabel: 'Купить' | 'Удалить из корзины' | 'Недоступно';
    buttonDisabled: boolean;
}

/** Данные для карточки в корзине */
export interface ICardCartData extends Pick<IProduct, 'id' | 'title' | 'price'> {
    index: number;
}

export interface IModalData {
    /** Заголовок модалки (опционально) */
    title?: string;

    /** Флаг активности */
    active?: boolean;
}