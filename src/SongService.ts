import ToneService from './ToneService'

export default class SongService extends ToneService {
  constructor(api: string, debug: boolean, sessionToken: string) {
    super(api, debug, sessionToken)
  }

  async uploadSongAudio(songId: string, file: File) {
    return new Promise(async (resolve, reject) => {
      this.debug && console.log('Adding song', songId)

      const url = this.api + '/catalog/songs/' + songId + '/upload'

      this.debug && console.log('API url:', url)

      const body = new FormData()

      body.append('file', file)

      await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
        },
        body,
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) reject(response.error)

          this.debug && console.log('Add Song Response', response)

          return resolve(response)
        })
        .catch((error) => {
          this.debug && console.log('Add Song Error Response', error)

          return reject(error)
        })
    })
  }
}
