import ToneService from './ToneService'

export default class UserService extends ToneService {
  constructor(sessionToken: string, api: string, debug: boolean) {
    super(sessionToken, api, debug)
  }

  createUser(data: any) {
    return new Promise(async (resolve, reject) => {
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
        .then((response) => response.json())
        .then((response) =>
          !response.ok ? reject(response) : resolve(response)
        )
        .catch((error) => reject(error))
    })
  }

  updateSelf(data: any) {
    return new Promise(async (resolve, reject) => {
      this.debug && console.log(`Updating self...`, { data })

      const url = this.api + '/users/self'

      this.debug && console.log('url: ' + url)

      return fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'BEARER ' + this.sessionToken,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) =>
          !response.ok ? reject(response) : resolve(response)
        )
        .catch((error) => reject(error))
    })
  }

  verifyEmail(data: any) {
    return new Promise(async (resolve, reject) => {
      const url = this.api + '/users/verify'

      this.debug && console.log('url: ' + url)
    })
  }
}
