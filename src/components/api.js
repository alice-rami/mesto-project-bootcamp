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

const request = (endpoint, options) => {
    return fetch(`${config.baseUrl}/${endpoint}`, options).then(checkResponse);
}

const loadUserData = () => {
    return request('users/me', {
        headers: config.headers
    });
}

const loadCardsData = () => {
    return request('cards', {
        headers: config.headers
    });
}

const editUserData = userData => {
    return request('users/me', {
        headers: config.headers,
        method: 'PATCH',
        body: JSON.stringify({
            name: userData.name,
            about: userData.about
        })
    });
}

const addNewCard = cardData => {
    return request('cards', {
        headers: config.headers,
        method: 'POST',
        body: JSON.stringify({
            name: cardData.name,
            link: cardData.link
        })
    });
}

const deleteCard = cardId => {
    return request(`cards/${cardId}`, {
        headers: config.headers,
        method: 'DELETE',
        body: JSON.stringify({
            _id: cardId
        })
    });
}

const addLike = cardId => {
    return request(`cards/likes/${cardId}`, {
        headers: config.headers,
        method: 'PUT',
        body: JSON.stringify({
            _id: cardId
        })
    });
}

const removeLike = cardId => {
    return request(`cards/likes/${cardId}`, {
        headers: config.headers,
        method: 'DELETE',
        body: JSON.stringify({
            _id: cardId
        })
    });
}

const updateAvatar = newAvatarLink => {
    return request('users/me/avatar', {
        headers: config.headers,
        method: 'PATCH',
        body: JSON.stringify({
            avatar: newAvatarLink
        })
    });
}

export { loadUserData, loadCardsData, editUserData, addNewCard, deleteCard, addLike, removeLike, updateAvatar };