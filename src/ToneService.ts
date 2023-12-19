export default class ToneService {
  sessionToken: string
  api: string
  debug: boolean

  constructor(sessionToken: string, api: string, debug: boolean) {
    this.sessionToken = sessionToken
    this.api = api
    this.debug = debug
  }
}
