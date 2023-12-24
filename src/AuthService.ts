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
          if (!response.ok) return reject(response)

          this.debug && console.log('Auth Response:', response)

          return resolve(response)
        })
        .catch((error: AuthEmailResponse) => {
          this.debug && console.log('Auth Error Response', error)

          return reject(error)
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
        .then(async (response) => {
          const data = await response.json()

          if (!data.ok) return reject(response)

          const sessionToken =
            response.headers.get('X-Tone-Session-Token') || ''

          !sessionToken && reject({ ok: false, message: 'NO_SESSION_TOKEN' })

          this.debug && console.log('Setting session token', sessionToken)

          localStorage.setItem('tone.session', sessionToken)

          setCookie('tone.session', sessionToken)

          return data
        })
        .then((response: VerifyCodeSuccess) => resolve(response))
        .catch((error) => {
          this.debug && console.log('Code Error Response', error)

          reject(error as VerifyCodeFail)
        })
    })
  }
}
