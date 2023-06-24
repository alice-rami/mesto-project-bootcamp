import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
    constructor({selector, form, handleFormSubmit}) {
        super(selector);
        this._form = form;
        this._handleFormSubmit = handleFormSubmit;
        this._cardForDeletion = {};
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => this._handleFormSubmit(evt, this._cardForDeletion));
    }

    _setCardForDeletion(cardId, cardElement) {
        this._cardForDeletion.id = cardId;
        this._cardForDeletion.element = cardElement;
    }

    open(cardId, cardElement) {
        this._setCardForDeletion(cardId, cardElement);
        super.open();
    }

}