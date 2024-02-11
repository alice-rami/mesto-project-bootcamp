import Popup from './Popup.js';

export default class PopupConfirmation extends Popup {
  constructor({ selector, form }, handleDeletion) {
    super(selector);
    this._form = form;
    this._handleDeletion = handleDeletion;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this._handleDeletion(this._cardInstance);
    });
  }

  setCardForDeletion(cardInstance) {
    this._cardInstance = cardInstance;
  }
}
