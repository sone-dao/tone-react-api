import AuthService from './AuthService'
import UserService from './UserService'

type ToneApiServiceConfig = {
  api: string
  debug: boolean
}

export default class ToneApiService {
  private api: string
  private debug: boolean

  auth: AuthService
  user: UserService

  constructor(config?: ToneApiServiceConfig) {
    this.api = config?.api || 'https://api.tone.audio/v1'

    this.debug = config?.debug || false

    this.auth = new AuthService(this.api, this.debug)

    this.user = new UserService(this.api, this.debug)
  }
}
