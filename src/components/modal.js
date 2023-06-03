const popupsList = document.querySelectorAll('.popup');
const popupCloseButtonsList = Array.from(document.querySelectorAll('.popup__close-icon'));

const closePopup = popup => {
    popup.classList.remove('popup_opened');
    document.removeEventListener('keydown', closeByEsc);
}

popupCloseButtonsList.forEach(item => {
    item.addEventListener('click', () => closePopup(item.closest('.popup')))
});

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

popupsList.forEach(popupElement => {
    popupElement.addEventListener('mousedown', closeByClickOnOverlay);
});

export { openPopup, closePopup };