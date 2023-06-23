export default class Popup {
    constructor(selector) {
        this._popup = document.querySelector(selector);
        this._popupCloseButton = this._popup.querySelector('.popup__close-icon');
    }

    open() {
        this._popup.classList.add('popup_opened');
        document.addEventListener('keydown', this._handleEscClose.bind(this));
    }
    
    close() {
        this._popup.classList.remove('popup_opened');
        document.removeEventListener('keydown', this._handleEscClose.bind(this));
    }

    setEventListeners() {
        this._popupCloseButton.addEventListener('click', this.close.bind(this));
        this._popup.addEventListener('mousedown', this._closeByClickOnOverlay.bind(this));  
    }

    _handleEscClose(evt) {
        if (evt.key === 'Escape') {
            this.close();
        }
    }

    _closeByClickOnOverlay(evt) {
        if (evt.target === this._popup) {
            this.close();
        }
    }
}