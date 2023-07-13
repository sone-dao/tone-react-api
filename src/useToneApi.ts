interface IToneReactApiAuthConfig {
  otp?: string
  nonce?: string
}

export default function useToneApi() {
  const api = 'https://api.tone.audio/v1'

  const accessToken = sessionStorage.getItem('tone.access')
  const sessionToken = localStorage.getItem('tone.session')

  const tone = {
    auth: {
      email: {
        /**
         *
         * @param email
         * @returns
         */
        attempt: async (email: string) =>
          await get(api + '/auth?email=' + email),
        /**
         *
         * @param email
         * @param config
         * @returns
         */
        auth: async (email: string, config: IToneReactApiAuthConfig) =>
          await post(api + '/auth?email', {
            otp: config.otp,
            nonce: config.nonce,
          }),
      },
    },
    users: {
      /**
       *
       * @param userId
       * @returns
       */
      get: async (userId: string) => await get(api + `/users/${userId}`),
      /**
       *
       * @param user
       * @returns
       */
      create: async (user: any) => await put(api + '/users', user),
      /**
       *
       * @param user
       * @returns
       */
      update: async (user: any) => await patch(api + '/users', user),
    },
    catalog: {
      entities: {
        /**
         *
         * @param entity
         * @returns
         */
        create: async (entity: any) => await put(api + '/entities', entity),
        /**
         *
         * @param entity
         * @returns
         */
        update: async (entity: any) => await patch(api + '/entities', entity),
      },
      releases: {
        /**
         *
         * @param release
         * @returns
         */
        create: async (release: any) => await put(api + '/releases', release),
        /**
         *
         * @param release
         * @returns
         */
        update: async (release: any) => await patch(api + '/releases', release),
      },
      songs: {
        /**
         *
         * @param song
         * @returns
         */
        create: async (song: any) => await put(api + '/songs', song),
        /**
         *
         * @param song
         * @returns
         */
        update: async (song: any) => await patch(api + '/songs', song),
      },
    },
  }

  return tone

  async function get(url: string) {
    const config = {
      headers: {
        Authorization: `BEARER ${accessToken}`,
      },
    }

    const result = await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))

    if (result.status !== 401) return result

    await genNewAccessToken()

    return await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function put(url: string, data: any) {
    const config = {
      method: 'PUT',
      headers: {
        Authorization: `BEARER ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const result = await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))

    if (result.status !== 401) return result

    await genNewAccessToken()

    return await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function patch(url: string, data: any) {
    const config = {
      method: 'PATCH',
      headers: {
        Authorization: `BEARER ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const result = await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))

    if (result.status !== 401) return result

    await genNewAccessToken()

    return await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function post(url: string, data: any) {
    const config = {
      method: 'POST',
      headers: {
        Authorization: `BEARER ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const result = await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))

    if (result.status !== 401) return result

    await genNewAccessToken()

    return await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function genNewAccessToken() {
    const newAccessToken = await fetch(api + 'auth/token/renew', {
      method: 'GET',
      headers: {
        Authorization: `BEARER ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => data.token.access)

    if (!newAccessToken) {
      //Send user to login page, etc
      localStorage.setItem('tone.session', '')
      return console.log('Invalid session token.')
    }

    sessionStorage.setItem('tone.access', newAccessToken)
  }
}
