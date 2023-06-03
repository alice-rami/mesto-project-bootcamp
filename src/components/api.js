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

const loadUserData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers
    })
    .then(checkResponse);
}

const loadCardsData = () => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers
    })
    .then(checkResponse);
}

const editUserData = userData => {
    return fetch(`${config.baseUrl}/users/me`, {
        headers: config.headers,
        method: 'PATCH',
        body: JSON.stringify({
            name: userData.name,
            about: userData.about
        })
    })
    .then(checkResponse);
}

const addNewCard = cardData => {
    return fetch(`${config.baseUrl}/cards`, {
        headers: config.headers,
        method: 'POST',
        body: JSON.stringify({
            name: cardData.name,
            link: cardData.link
        })
    })
    .then(checkResponse);
}

const deleteCard = cardId => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        headers: config.headers,
        method: 'DELETE',
        body: JSON.stringify({
            _id: cardId
        })
    })
    .then(checkResponse);
}

const addLike = cardId => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        headers: config.headers,
        method: 'PUT',
        body: JSON.stringify({
            _id: cardId
        })
    })
    .then(checkResponse);
}

const removeLike = cardId => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        headers: config.headers,
        method: 'DELETE',
        body: JSON.stringify({
            _id: cardId
        })
    })
    .then(checkResponse);
}

const updateAvatar = newAvatarLink => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        headers: config.headers,
        method: 'PATCH',
        body: JSON.stringify({
            avatar: newAvatarLink
        })
    })
    .then(checkResponse);
}

export { loadUserData, loadCardsData, editUserData, addNewCard, deleteCard, addLike, removeLike, updateAvatar };