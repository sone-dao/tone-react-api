import { win } from '@sone-dao/sone-react-utils'
import { getCookie } from 'cookies-next'
import AuthService from './AuthService'
import EntityService from './EntityService'
import JukeboxService from './JukeboxService'
import ReleaseService from './ReleaseService'
import SongService from './SongService'
import TagService from './TagService'
import UserService from './UserService'

export default class ToneApiService {
  private api: string
  private debug: boolean
  private sessionToken: string

  auth: AuthService
  user: UserService
  entities: EntityService
  tags: TagService
  releases: ReleaseService
  songs: SongService
  jukebox: JukeboxService

  constructor(sessionToken?: string) {
    const debug = (win && win.__TONE_DEBUG__) || {}

    this.api =
      process?.env.TONE_API || debug?.api || 'https://api.tone.audio/v1'

    this.debug = debug?.isDebug || false

    const sessionCookie = getCookie('tone.session') as string

    this.sessionToken = sessionToken || sessionCookie

    this.auth = new AuthService(this.api, this.debug, this.sessionToken)

    this.user = new UserService(this.api, this.debug, this.sessionToken)

    this.entities = new EntityService(this.api, this.debug, this.sessionToken)

    this.tags = new TagService(this.api, this.debug, this.sessionToken)

    this.releases = new ReleaseService(this.api, this.debug, this.sessionToken)

    this.songs = new SongService(this.api, this.debug, this.sessionToken)

    this.jukebox = new JukeboxService(this.api, this.debug, this.sessionToken)
  }
}
