 class Api {
    constructor({baseUrl, headers}){
        this._baseUrl = baseUrl;
        this._headers = headers;
    }

    _checkStatus(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    _request(url, options) {
        return fetch(this._baseUrl + url, options).then(this._checkStatus);
    }

    getUserInfo() {
        return this._request(`/users/me`, {
            headers: this._headers
        });
    }

    getInitialCards() {
        return this._request(`/cards`,  {
            headers: this._headers
        });
    }

    setProfileInfo({name, about}) {
       return this._request(`/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                about: about
            })
        });
    }

    addNewCard({name, link}) {
        return this._request(`/cards`, {
            method: 'POST', 
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                link: link
            })
        });
    }

    setLikeCount(id) {
        return this._request(`/cards/likes/${id}`, {
            method: 'PUT',
            headers: this._headers
        });
    }

    deleteLikeCount(id) {
        return this._request(`/cards/likes/${id}`, {
            method: 'DELETE',
            headers: this._headers
        });
    }

    deleteCard(id) {
        return this._request(`/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers
        });
    }

    setAvatar(data) {
       return this._request(`/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: data.avatar
            })
        });
    }

    changeLikeCardStatus(id, isLiked) {
        if (!isLiked) {
            return api.setLikeCount(id)
        } else {
            return api.deleteLikeCount(id);
        }
    }
}

export const api = new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-63',
    headers: {
      authorization: 'b4997ac3-87d8-4b2f-aabd-f23b0e31024b',
      'Content-Type': 'application/json'
    }
  });