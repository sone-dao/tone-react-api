import { setCookie } from 'cookies-next'
import ToneService from './ToneService'

type UserResponseSuccess = {
  ok: boolean
  message: string
  user: any
}

type UserResponseFail = {
  ok: boolean
  message: string
  error: any
}

export default class UserService extends ToneService {
  constructor(api: string, debug: boolean) {
    super(api, debug)
  }

  async createUser(data: any) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log(`Creating user...`, { data })

      const url = this.api + '/users'

      this.debug && console.log('url: ' + url)

      return fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(async (response) =>
          resolve((await response.json()) as UserResponseSuccess)
        )
        .catch((error) => reject(error as UserResponseFail))
    })
  }

  async updateUser(data: any) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log(`Updating user...`, { data })

      const url = this.api + '/users'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: 'BEARER ' + this.getSessionToken(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(async (response) =>
          resolve((await response.json()) as UserResponseSuccess)
        )
        .catch((error) => reject(error as UserResponseFail))
    })
  }

  async verifyEmail(email: string, code: string) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      const url = this.api + '/users/verify/' + email

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'BEARER ' + this.getSessionToken(),
        },
        body: JSON.stringify({ email, code }),
      })
        .then(async (response) => {
          const sessionToken =
            response.headers.get('X-Tone-Session-Token') || ''

          if (sessionToken) {
            console.log({ sessionToken })

            localStorage.setItem('tone.session', sessionToken)

            setCookie('tone.session', sessionToken)
          }

          resolve((await response.json()) as UserResponseSuccess)
        })
        .catch((error) => reject(error as UserResponseFail))
    })
  }

  async getAvatar(userId: string) {
    return new Promise<Blob>(async (resolve, reject) => {
      this.debug && console.log('Getting avatar...')

      const url = this.api + `/users/${userId}/avatar`

      this.debug && console.log('url: ' + url)

      fetch(url)
        .then((response) => response.blob())
        .then((blob) => resolve(blob))
        .catch((error) => reject(error))
    })
  }

  async uploadAvatar(data: any) {
    this.debug && console.log('Uploading avatar...')

    const url = this.api + '/users/upload/avatar'
    this.debug && console.log('url: ' + url)

    const body = new FormData()

    body.append('file', data.file)
    body.append('userId', data.userId)

    console.log({ body })

    return await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: 'BEARER ' + this.getSessionToken(),
      },
      body,
    }).then((response) => response.json())
  }

  async signoutUser() {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log('Signing out user...')

      const url = this.api + '/users/signout'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'BEARER ' + this.getSessionToken(),
          'Content-Type': 'application/json',
        },
      })
        .then(async (response) => response.json())
        .then((response: UserResponseSuccess) => resolve(response))
        .catch((error) => reject(error as UserResponseFail))
    })
  }
}
