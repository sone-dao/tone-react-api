import { getCookie } from 'cookies-next'

export default class ToneService {
  api: string
  debug: boolean
  sessionToken: string

  constructor(api: string, debug: boolean, sessionToken: string) {
    this.api = api
    this.debug = debug
    this.sessionToken = sessionToken
  }

  getSessionToken() {
    return this.sessionToken || getCookie('tone.session')
  }
}
