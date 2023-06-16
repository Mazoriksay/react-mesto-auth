class Auth {
    constructor({ baseUrl, headers }) {
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

    checkToken(token) {
        return this._request(`/users/me`, {
            method: 'GET',
            headers: {
                ...this._headers,
                'Authorization': `Bearer ${token}`,
            }
        });
    }

    register({email, password}) {
        return this._request('/signup', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                "password": password,
                "email": email
            })
        });
    }

    authorize({email, password}) {
        return this._request('/signin', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                "password": password,
                "email": email
            })
        })
        .then((data) => {
            localStorage.setItem('jwt', data.token); 
        })
    }
}

export const auth = new Auth({
    baseUrl: 'https://auth.nomoreparties.co',
    headers: {
      'Content-Type': 'application/json'
    }
  });