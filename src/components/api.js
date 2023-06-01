const config = {
    baseUrl: 'https://nomoreparties.co/v1/wbf-cohort-9',
    headers: {
        authorization: 'c1d6c920-f67e-42f9-9dd3-963993549d9b',
        'Content-Type': 'application/json'
    }
}

const checkResponse = res => {
    if (res.ok) {
        return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
}

// Загрузка информации о пользователе с сервера

const loadUserData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(checkResponse);
}

const loadInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then(checkResponse);
}

export { loadUserData, loadInitialCards };