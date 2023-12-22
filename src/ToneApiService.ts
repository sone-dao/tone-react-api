import { win } from '@sone-dao/sone-react-utils'
import AuthService from './AuthService'
import UserService from './UserService'

export default class ToneApiService {
  private api: string
  private debug: boolean

  auth: AuthService
  user: UserService

  constructor() {
    const debug = (win && win.__TONE_DEBUG__) || {}

    this.api = debug?.api || 'https://api.tone.audio/v1'

    this.debug = debug?.isDebug || false

    this.auth = new AuthService(this.api, this.debug)

    this.user = new UserService(this.api, this.debug)
  }
}
