const loader = 'Сохранение...'

const showLoader = (evt) => {
    evt.submitter.textContent = loader;
}
    
const restoreButtonText = (evt, buttonText) => {
    evt.submitter.textContent = buttonText;
}

export { showLoader, restoreButtonText };