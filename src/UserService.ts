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

  async getSelf() {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log('Getting self...')

      const url = this.api + '/users'

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'BEARER ' + this.getSessionToken(),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response as UserResponseFail)

          this.debug && console.log('Get Self Response', response)

          return resolve(response as UserResponseSuccess)
        })
        .catch((error: UserResponseFail) => {
          this.debug && console.log('Get Self Error Response', error)

          return reject(error)
        })
    })
  }

  async createUser(data: any) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log(`Creating user...`, { data })

      const url = this.api + '/users'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response as UserResponseFail)

          this.debug && console.log('Create User Response', response)

          return resolve(response as UserResponseSuccess)
        })
        .catch((error: UserResponseFail) => {
          this.debug && console.log('Create User Error Response', error)

          return reject(error)
        })
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
        .then((response) => response.json())
        .then((response) => {
          if (!response) return reject(response as UserResponseFail)

          this.debug && console.log('Update User Response', response)

          return resolve(response)
        })
        .catch((error: UserResponseFail) => {
          this.debug && console.log('Update User Error Response', error)

          return reject(error)
        })
    })
  }

  async verifyEmail(email: string, code: string) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log('Verifying user email...')

      const url = this.api + '/users/verify'

      this.debug && console.log('url: ' + url)

      this.debug && console.log('Request body', { email, code })

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })
        .then(async (response) => {
          const sessionToken =
            response.headers.get('X-Tone-Session-Token') || ''

          if (sessionToken) {
            this.debug && console.log({ sessionToken })

            localStorage.setItem('tone.session', sessionToken)

            fetch('/api/cookie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ sessionToken }),
            }).catch((error) => {
              this.debug &&
                console.log('Error setting session token cookie on server', {
                  error,
                })
            })
          }

          return response.json()
        })
        .then((response) => {
          if (!response.ok) return reject(response as UserResponseFail)

          this.debug && console.log('User Verification Response', { response })

          return resolve(response)
        })
        .catch((error: UserResponseFail) => {
          this.debug && console.log('Create User Error Response', { error })

          return reject(error)
        })
    })
  }

  async reverifyEmail(email: string) {
    return new Promise<UserResponseSuccess>(async (resolve, reject) => {
      this.debug && console.log('Reverifying e-mail...')

      const url = this.api + `/users/reverify`

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((response: UserResponseSuccess) => {
          this.debug && console.log('E-mail Reverification Response', response)

          resolve(response)
        })
        .catch((error: UserResponseFail) => {
          this.debug && console.log('E-mail Reverification Error', error)

          reject(error)
        })
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

    fetch(url, {
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
