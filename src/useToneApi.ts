export default function useToneApi() {
  const api = 'https://tone.audio/api/v1'
  const auth = 'https://auth.tone.audio'

  const accessToken = sessionStorage.getItem('tone.access')
  const sessionToken = localStorage.getItem('tone.session')

  const tone = {
    auth: {
      email: {
        attempt: async (email: string) =>
          await get(auth + '/email?email=' + email),
        login: async (email: string, nonce: string) =>
          await get(auth + '/email/login?email=' + email + '&nonce=' + nonce),
      },
    },
  }

  return tone

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

  async function genNewAccessToken() {
    const newAccessToken = await fetch(auth + '/token/renew', {
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
