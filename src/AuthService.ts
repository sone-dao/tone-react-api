import ToneService from './ToneService'

export default class AuthService extends ToneService {
  constructor(api: string, debug: boolean) {
    super(api, debug)
  }

  sendAuthEmail(email: string) {
    return new Promise(async (resolve, reject) => {
      this.debug && console.log(`Sending auth e-mail to: ${email}...`)

      const url = this.api + '/auth/email/' + email

      this.debug && console.log('url: ' + url)

      return fetch(url)
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  verifyCode(email: string, code: string) {
    return new Promise(async (resolve, reject) => {
      this.debug && console.log(`Verifying code...`)

      const url = this.api + `/auth/email/${email}/${code}`

      this.debug && console.log('url: ' + url)

      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          const sessionToken =
            response.headers.get('x-tone-session-token') || ''

          !sessionToken && reject({ ok: false, message: 'NO_SESSION_TOKEN' })

          localStorage.setItem('tone.session', sessionToken)

          return response.json()
        })
        .then((response) =>
          !response.ok ? reject(response) : resolve(response)
        )
        .catch((error) => reject(error))
    })
  }
}
