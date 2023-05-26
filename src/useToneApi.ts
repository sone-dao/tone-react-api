interface ILyrics {
  language: string
  text: string
  lines?: {
    line: string
    start: number
    stop: number
  }[]
}

export default function useToneApi() {
  const api = 'https://api.tone.audio'
  const auth = 'https://auth.tone.audio'

  const accessToken = sessionStorage.getItem('tone.access')

  const tone = {
    artist: {
      create: async (owners: string[], display: string, unique: string) =>
        await post(api + '/artist', { owners, display, unique }),
    },
    artists: {
      search: async (term: string) => await get(api + '/artists?q=' + term),
    },
    auth: {
      sendNonce: async (email: string) => await post(auth + '/email', {email}),
      nonce: async (email: string, nonce: string, additionalData: any) =>
        await post(auth + '/nonce', { email, nonce, additionalData }),
      token: async (token: string) => await post(auth + '/token', { token }),
    },
    credits: {
      search: async (term: string) => await get(api + '/credits?q=' + term),
    },
    label: {
      create: async (owners: string[]) =>
        await post(api + '/label', { owners }),
    },
    people: {
      search: async (term: string) => await get(api + '/people?q=' + term),
    },
    person: {
      create: async (person: string) => await post(api + '/person', { person }),
    },
    release: {
      create: async (
        owners: string[],
        display: { release: string; artist: string } = {
          release: '',
          artist: '',
        },
        artists: string[] = [],
        labels: string[] = [],
        info: string = ''
      ) =>
        await post(api + '/release', {
          owners,
          display,
          artists,
          labels,
          info,
        }),
      upload: {
        art: async () => {},
      },
    },
    song: {
      create: async (
        releaseId: string,
        artistIds: string[],
        title: string = '',
        description: string = '',
        lyrics: ILyrics[] = [],
        duration: number = 0
      ) =>
        await post(api + '/song', {
          releaseId,
          artistIds,
          title,
          description,
          lyrics,
          duration,
        }),
    },
    tag: {
      create: async (tag: string) => await post(api + '/tag', { tag }),
    },
    tags: {
      search: async (term: string) => await get(api + '/tags?q=' + term),
    },
    user: {
      get: async () => await get(api + '/user'),
    },
  }

  return tone

  async function post(url: string, data: any) {
    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `BEARER ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function get(url: string) {
    return await fetch(url, {
      headers: {
        Authorization: `BEARER ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }
}
