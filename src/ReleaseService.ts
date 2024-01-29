import ToneService from './ToneService'

type Release = {
  artists: any[]
  tags?: any[]
  catalog?: string
  colors: [string, string]
  credits?: string
  description?: string
  display: string
  songs: any[]
  upc?: string
}

export default class ReleaseService extends ToneService {
  constructor(api: string, debug: boolean, sessionToken: string) {
    super(api, debug, sessionToken)
  }

  addRelease(release: Release) {
    return new Promise(async (resolve, reject) => {
      this.debug && console.log('Adding release', release)

      const url = this.api + '/catalog/releases'

      this.debug && console.log('API url:', url)

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
        },
        body: JSON.stringify(release),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response)

          this.debug && console.log('Add Release Response', response)

          return resolve(response.release)
        })
        .catch((error) => {
          this.debug && console.log('Add Release Error Response', error)

          return reject(error)
        })
    })
  }

  getReleaseBySlug(entityUniqueUrl: string, releaseSlug: string) {
    return new Promise<Release>(async (resolve, reject) => {
      this.debug &&
        console.log('Getting release by slug', { entityUniqueUrl, releaseSlug })

      const url =
        this.api + '/catalog/entities/' + entityUniqueUrl + '/' + releaseSlug

      this.debug && console.log('API url:', url)

      await fetch(url, {
        headers: {
          Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response.error)

          resolve(response.release)
        })
        .catch((error) => reject(error))
    })
  }
}
