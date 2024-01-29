import ToneService from './ToneService'

export default class EntityService extends ToneService {
  constructor(api: string, debug: boolean, sessionToken: string) {
    super(api, debug, sessionToken)
  }

  async createEntity(data: any) {
    return new Promise<any>(async (resolve, reject) => {
      this.debug && console.log(`Creating entity...`, { data })

      const url = this.api + '/entities'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response)

          this.debug && console.log('Create Entity Response', response)

          return resolve(response)
        })
        .catch((error) => {
          this.debug && console.log('Create Entity Error Response', error)

          return reject(error)
        })
    })
  }

  async addCustodial(entityId: string, custodialEntity: any) {
    return new Promise<any>(async (resolve, reject) => {
      this.debug && console.log('Adding custodial artist...')

      const url = this.api + '/catalog/entities/' + entityId + '/custodial'

      this.debug && console.log('url: ' + url)

      fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(custodialEntity),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response)

          this.debug &&
            console.log('Create Custodial Artist Response', response)

          return resolve(response)
        })
        .catch((error) => {
          this.debug &&
            console.log('Create Custodial Artist Error Response', error)

          return reject(error)
        })
    })
  }

  async uploadAvatar(entityId: string, file: File) {
    this.debug && console.log('Uploading avatar...')

    const url = this.api + '/catalog/entities/' + entityId + '/avatar'

    this.debug && console.log('url: ' + url)

    const body = new FormData()

    body.append('file', file)

    return fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: this.sessionToken && 'BEARER ' + this.sessionToken,
      },
      body,
    }).then((response) => response.json())
  }

  getAvatarUrlByName(uniqueUrl: string) {
    return this.api + '/catalog/entities/' + uniqueUrl + '/avatar'
  }
}
