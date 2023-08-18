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
        attempt: async (email: string) =>
          await get(api + '/auth?email=' + email),

        auth: async (email: string, config: IToneReactApiAuthConfig) =>
          await post(api + '/auth?email=' + email, {
            otp: config.otp,
            nonce: config.nonce,
          }),
      },
      token: {
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
      self: async () => await get(api + '/users/self'),

      get: async (userId: string = '') =>
        await get(api + '/users?userId=' + userId),

      create: async (user: any) => await put(api + '/users', user),

      update: async (user: any) => await patch(api + '/users', user),
    },
    catalog: {
      entities: {
        get: async (entityId: string = '') =>
          await get(api + '/catalog/entities?entityId=' + entityId),

        create: async (entity: any) =>
          await put(api + '/catalog/entities', entity),

        update: async (entity: any) =>
          await patch(api + '/catalog/entities', entity),
      },
      release: {
        get: async (releaseId: string) =>
          await get(api + '/catalog/release/' + releaseId),

        getSongs: async (releaseId: string) =>
          await get(api + '/catalog/release/' + releaseId + '/songs'),

        create: async (release: any) =>
          await put(api + '/catalog/release', release),

        update: async (releaseId: string, release: any) =>
          await patch(api + '/catalog/release/' + releaseId, release),

        artwork: {
          get: async (releaseId: string, type: string, size: string) =>
            await get(
              api + `/catalog/release/${releaseId}/art/${type}/${size}`
            ),

          upload: async (releaseId: string, type: string, file: File) => {
            const formData = new FormData()

            formData.append('file', file)

            return await fetch(
              api + '/catalog/release/' + releaseId + '/art/' + type,
              {
                method: 'PUT',
                headers: {
                  Authorization:
                    'BEARER ' + sessionStorage.getItem('tone.access'),
                },
                body: formData,
              }
            )
              .then((response) => response.json())
              .catch((error) => console.log(error))
          },
        },
      },
      releases: {
        get: async () => await get(api + '/catalog/releases'),
      },
      song: {
        get: async (songId: string = '') =>
          await get(api + '/catalog/song/' + songId),

        create: async (song: any) => await put(api + '/catalog/song', song),

        update: async (songId: string, song: any) =>
          await patch(api + '/catalog/song/' + songId, song),

        upload: async (songId: string, type: string, file: File | Blob) => {
          const formData = new FormData()

          formData.append('file', file)

          return await fetch(
            api + '/catalog/song/' + songId + '/upload?type=' + type,
            {
              method: 'PUT',
              headers: {
                Authorization:
                  'BEARER ' + sessionStorage.getItem('tone.access'),
              },
              body: formData,
            }
          )
            .then((response) => response.json())
            .catch((error) => console.log(error))
        },
      },
      songs: {
        get: async () => await get(api + '/catalog/songs'),
      },
      tag: {
        get: async (tagId: string) => await get(api + '/catalog/tag/' + tagId),

        create: async (tag: any) => await put(api + '/catalog/tag', tag),
      },
      tags: {
        get: async (tagIds: string) =>
          await get(api + '/catalog/tags/' + tagIds),

        search: async (term: string) =>
          await get(api + '/catalog/tags/search/' + term),
      },
    },
  }

  return tone

  async function get(url: string) {
    return await apiFetch('GET', url)
  }

  async function put(url: string, data: any, config?: any) {
    return await apiFetch('PUT', url, data, config)
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
