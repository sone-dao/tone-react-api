export default class ToneService {
  api: string
  debug: boolean

  constructor(api: string, debug: boolean) {
    this.api = api
    this.debug = debug
  }

  getSessionToken() {
    return localStorage.getItem('tone.session')
  }
}
