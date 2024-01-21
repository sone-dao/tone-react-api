import ToneService from './ToneService'

type Tag = {
  tagId: string
  display: string
  tag: string
}

export default class TagService extends ToneService {
  constructor(api: string, debug: boolean) {
    super(api, debug)
  }

  async searchByDisplay(display: string) {
    return new Promise<Tag[]>(async (resolve, reject) => {
      this.debug && console.log('Searching for tag by display...', display)

      const url =
        this.api + '/catalog/tags/search/' + encodeURIComponent(display)

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'BEARER ' + this.getSessionToken(),
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response)

          this.debug && console.log('Search By Display Response', response)

          return resolve(response.tags || [])
        })
        .catch((error) => {
          this.debug &&
            console.log('Search Tags By Display Error Response', error)

          return reject(error)
        })
    })
  }

  async addTag(display: string) {
    return new Promise<Tag>(async (resolve, reject) => {
      this.debug && console.log('Adding tag', display)

      const url = this.api + '/catalog/tags'

      fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'BEARER ' + this.getSessionToken(),
        },
        body: JSON.stringify({ display }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (!response.ok) return reject(response)

          this.debug && console.log('Add Tag Response', response)

          return resolve(response.tag)
        })
        .catch((error) => {
          this.debug && console.log('Add Tag Error Response', error)

          return reject(error)
        })
    })
  }
}
