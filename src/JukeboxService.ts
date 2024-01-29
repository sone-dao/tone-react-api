import ToneService from './ToneService'

export default class JukeboxService extends ToneService {
  constructor(api: string, debug: boolean, sessionToken: string) {
    super(api, debug, sessionToken)
  }

  getJukeboxToken(songId: string, fidelity: string) {
    return new Promise<string>(async (resolve, reject) => {
      this.debug &&
        console.log(`Getting jukebox token...`, { songId, fidelity })

      const url = this.api + '/jukebox/' + songId + '/' + fidelity

      this.debug && console.log('API url: ' + url)

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'BEARER ' + this.sessionToken,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          this.debug && console.log('Jukebox Token Response', response)

          return response.token
            ? resolve(response.token)
            : reject(response.error)
        })
        .catch((error) => {
          this.debug && console.log('Jukebox Token Error Response', error)

          return reject(error)
        })
    })
  }
}
