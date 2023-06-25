import Popup from "./Popup.js";

export default class PopupConfirmation extends Popup {
    constructor({selector, form}, handleDeletion) {
        super(selector);
        this._form = form;
        this._handleDeletion = handleDeletion;
    }

    setEventListeners() {
        super.setEventListeners();
        this._form.addEventListener('submit', (evt) => this._handleDeletion(evt, this._cardForDeletionId, this._cardInstance));
    }

    setCardForDeletion(cardId, cardInstance) {
        this._cardForDeletionId = cardId;
        this._cardInstance = cardInstance;
    }
}