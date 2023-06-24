import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
    constructor({selector, form, handleFormSubmit}) {
        super(selector);
        this._form = form;
        this._handleFormSubmit = handleFormSubmit;
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => this._handleFormSubmit(evt, this._cardForDeletionId, this._cardInstance));
    }

    _setCardForDeletion(cardId, cardInstance) {
        this._cardForDeletionId = cardId;
        this._cardInstance = cardInstance;
    }

    open(cardId, cardInstance) {
        this._setCardForDeletion(cardId, cardInstance);
        super.open();
    }

}