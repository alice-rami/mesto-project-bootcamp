import { settings } from "../../index.js";
import { hideError } from "./validate.js";

export const closePopup = popup => {
    popup.classList.remove('popup_opened');
    const popupForm = popup.querySelector(settings.formSelector);
    const inputsList = Array.from(popupForm.querySelectorAll(settings.inputSelector));
    inputsList.forEach(inputField => {
        hideError(inputField);
    });
    popupForm.reset();
}

const closeByEsc = (evt) => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_opened');
        closePopup(openedPopup);
        document.removeEventListener('keydown', closeByEsc);
    }
}

export const openPopup = popup => {
    popup.classList.add('popup_opened');
    document.addEventListener('keydown', closeByEsc);
}

export const closeByClickOnOverlay = (evt) => {
    if (evt.target.classList.contains('popup')) {
        closePopup(evt.target);
    }
}