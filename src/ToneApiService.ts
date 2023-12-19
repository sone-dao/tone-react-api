import { win } from '@sone-dao/sone-react-utils'
import AuthService from './AuthService'
import UserService from './UserService'

type ToneApiServiceConfig = {
  api: string
  debug: boolean
}

export default class ToneApiService {
  sessionToken: string
  api: string
  debug: boolean

  auth: AuthService
  user: UserService

  constructor(config: ToneApiServiceConfig) {
    this.sessionToken = (win && localStorage.getItem('tone.session')) || ''

    this.api = config.api || 'https://api.tone.audio/v1'

    this.debug = config.debug || false

    this.auth = new AuthService(this.sessionToken, this.api, this.debug)

    this.user = new UserService(this.sessionToken, this.api, this.debug)
  }
}
