'use client'

import { useRouter } from 'next/navigation'

interface IToneReactApiAuthConfig {
  otp?: string
  nonce?: string
}

export default function useToneApi() {
  const router = useRouter()

  const api = 'https://api.tone.audio/v1'

  const tone = {
    auth: {
      email: {
        /**
         *
         * @param {string} email - The user's email address.
         * @returns
         */
        attempt: async (email: string) =>
          await get(api + '/auth?email=' + email),
        /**
         *
         * @param {string} email - The user's email address.
         * @param {Object} config - Config object for Tone API route.
         * @param {string} config.otp - The user supplied time password.
         * @param {string} config.nonce - The user supplied nonce.
         * @returns
         */
        auth: async (email: string, config: IToneReactApiAuthConfig) =>
          await post(api + '/auth?email=' + email, {
            otp: config.otp,
            nonce: config.nonce,
          }),
      },
      token: {
        /**
         *
         * @returns
         */
        refresh: async () =>
          await fetch(api + '/auth/token/refresh', {
            method: 'GET',
            headers: {
              Authorization: 'BEARER ' + localStorage.getItem('tone.session'),
            },
          })
            .then((response) => response.json())
            .catch((error) => error),
      },
    },
    users: {
      /**
       *
       * @returns
       */
      self: async () => await get(api + '/users/self'),
      /**
       *
       * @param {string} userId - The user's public ID on Tone.
       * @returns
       */
      get: async (userId: string = '') =>
        await get(api + '/users?userId=' + userId),
      /**
       *
       * @param user - User object
       * @returns
       */
      create: async (user: any) => await put(api + '/users', user),
      /**
       *
       * @param user - User object
       * @returns
       */
      update: async (user: any) => await patch(api + '/users', user),
    },
    catalog: {
      entities: {
        /**
         *
         * @param entityId
         * @returns
         */
        get: async (entityId: string = '') =>
          await get(api + '/catalog/entities?entityId=' + entityId),
        /**
         *
         * @param entity - Entity object
         * @returns
         */
        create: async (entity: any) =>
          await put(api + '/catalog/entities', entity),
        /**
         *
         * @param entity - Entity object
         * @returns
         */
        update: async (entity: any) =>
          await patch(api + '/catalog/entities', entity),
      },
      releases: {
        /**
         *
         * @param releaseId
         * @returns
         */
        get: async (releaseId: string = '') =>
          await get(api + '/catalog/releases?releaseId=' + releaseId),
        /**
         *
         * @param release - Release object
         * @returns
         */
        create: async (release: any) =>
          await put(api + '/catalog/releases', release),
        /**
         *
         * @param release - Release object
         * @returns
         */
        update: async (release: any) =>
          await patch(api + '/catalog/releases', release),
      },
      songs: {
        /**
         *
         * @param songId - id of song on Tone
         * @returns
         */
        get: async (songId: string = '') =>
          await get(api + '/catalog/songs?songId=' + songId),
        /**
         *
         * @param song - Song object
         * @returns
         */
        create: async (song: any) => await put(api + '/catalog/songs', song),
        /**
         *
         * @param song - Song object
         * @returns
         */
        update: async (song: any) => await patch(api + '/catalog/songs', song),
      },
    },
  }

  return tone

  async function get(url: string) {
    return await apiFetch('GET', url)
  }

  async function put(url: string, data: any) {
    return await apiFetch('PUT', url, data)
  }

  async function patch(url: string, data: any) {
    return await apiFetch('PATCH', url, data)
  }

  async function post(url: string, data: any) {
    return await apiFetch('POST', url, data)
  }

  async function apiFetch(
    method: string,
    url: string,
    data?: any,
    fetchConfig?: object
  ) {
    const accessToken = sessionStorage.getItem('tone.access')

    const config = fetchConfig || {
      method,
      headers: {
        Authorization: 'BEARER ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }

    const result =
      (await fetch(url, config)
        .then((response) => response.json())
        .catch((error) => error)) || false

    if (result.status !== 401) return result

    await genNewAccessToken()

    return await fetch(url, config)
      .then((response) => response.json())
      .catch((error) => console.log(error))
  }

  async function genNewAccessToken() {
    const sessionToken = localStorage.getItem('tone.session')

    const newAccessToken = await fetch(api + '/auth/token/refresh', {
      method: 'GET',
      headers: {
        Authorization: `BEARER ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => data.tokens.access)

    if (!newAccessToken) {
      //Send user to login page, etc
      localStorage.setItem('tone.session', '')
      return router.push('/login?t=expired')
    }

    sessionStorage.setItem('tone.access', newAccessToken)
  }
}
