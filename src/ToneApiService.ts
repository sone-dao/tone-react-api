'use client'

import { win } from '@sone-dao/sone-react-utils'

export default class ToneApiService {
  sessionToken: string | null
  api: string
  debug: boolean

  constructor() {
    this.sessionToken = win && localStorage.getItem('tone.session')
    this.api = (win && win.TONE_DEBUG?.api) || 'https://api.tone.audio/v1'
    this.debug = win && !win.TONE_DEBUG ? false : true
  }

  auth = {
    /**
     *
     * @param email
     * @returns
     */
    sendAuthEmail: (email: string) =>
      new Promise(async (resolve, reject) => {
        this.debug && console.log(`Sending auth e-mail to: ${email}...`)

        const url = this.api + '/auth/email/' + email

        this.debug && console.log('url: ' + url)

        return fetch(url)
          .then((response) => response.json())
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      }),
    verifyCode: (email: string, code: string) =>
      new Promise(async (resolve, reject) => {
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
      }),
  }

  user = {
    createUser: (data: any) =>
      new Promise(async (resolve, reject) => {
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
      }),
    updateSelf: (data: any) =>
      new Promise(async (resolve, reject) => {
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
      }),
  }
}
