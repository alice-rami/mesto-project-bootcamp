// Сохранение...
export const renderLoading = (isLoading, button, buttonText='Сохранить', loadingText='Сохранение...') => {
    button.textContent = isLoading ? loadingText : buttonText;
}