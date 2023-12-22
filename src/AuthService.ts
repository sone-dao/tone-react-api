import { setCookie } from 'cookies-next'
import ToneService from './ToneService'

type AuthEmailResponse = {
  ok: boolean
  message: string
}

type VerifyCodeSuccess = {
  ok: boolean
  message: string
  user: any
}

type VerifyCodeFail = {
  ok: boolean
  message: string
  error: any
}

export default class AuthService extends ToneService {
  constructor(api: string, debug: boolean) {
    super(api, debug)
  }

  sendAuthEmail(email: string) {
    return new Promise<AuthEmailResponse>(async (resolve, reject) => {
      this.debug && console.log(`Sending auth e-mail to: ${email}...`)

      const url = this.api + '/auth/email'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((response: AuthEmailResponse) => {
          this.debug && console.log('Auth Response:', response)

          resolve(response)
        })
        .catch((error: AuthEmailResponse) => {
          this.debug && console.log('Auth Error Response', error)

          reject(error)
        })
    })
  }

  verifyCode(email: string, code: string) {
    return new Promise<VerifyCodeSuccess>(async (resolve, reject) => {
      this.debug && console.log(`Verifying code...`)

      const url = this.api + '/auth/email'

      this.debug && console.log('url: ' + url)

      return fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })
        .then((response) => {
          const sessionToken =
            response.headers.get('X-Tone-Session-Token') || ''

          !sessionToken && reject({ ok: false, message: 'NO_SESSION_TOKEN' })

          this.debug && console.log('Setting session token', sessionToken)

          localStorage.setItem('tone.session', sessionToken)

          setCookie('tone.session', sessionToken)

          return response.json()
        })
        .then((response) =>
          !response.ok
            ? reject(response as VerifyCodeFail)
            : resolve(response as VerifyCodeSuccess)
        )
        .catch((error) => {
          this.debug && console.log('Code Error Response', error)

          reject(error as VerifyCodeFail)
        })
    })
  }
}
