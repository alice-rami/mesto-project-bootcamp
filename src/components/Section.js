export default class Section {
    constructor({items, renderer}, selector) {
        this._renderedItems = items;
        this._renderer = renderer;
        this._container = document.querySelector(selector);
        this._cardForDeletion = {};
    }

    renderItems() {
        this._renderedItems.forEach(item => {
            this._renderer(item)
        });
    }

    addItem(element) {
        this._container.prepend(element);
    }

    getCardForDeletion() {
        return this._cardForDeletion;
    }

    setCardForDeletion(cardId, cardElement) {
        this._cardForDeletion.id = cardId;
        this._cardForDeletion.element = cardElement;
    }
}