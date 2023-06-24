export default class Section {
    constructor(renderItems, selector) {
        this._renderer = renderItems;
        this._container = document.querySelector(selector);
    }

    renderItems(items) {
        this._renderer(items);
    }

    addItem(element) {
        this._container.prepend(element);
    }
}