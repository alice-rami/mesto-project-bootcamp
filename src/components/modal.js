const closePopup = popup => {
    popup.classList.remove('popup_opened');
    document.removeEventListener('keydown', closeByEsc);
}

const closeByEsc = (evt) => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_opened');
        closePopup(openedPopup);
    }
}

const openPopup = popup => {
    popup.classList.add('popup_opened');
    document.addEventListener('keydown', closeByEsc);
}

const closeByClickOnOverlay = (evt) => {
    if (evt.target.classList.contains('popup')) {
        closePopup(evt.target);
    }
}

export { openPopup, closePopup, closeByClickOnOverlay };