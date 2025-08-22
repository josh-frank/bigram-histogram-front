import useSWR from 'swr'
// import useSWRMutation from 'swr/mutation'

export const server = import.meta.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://172.104.210.107'

export const responseToJson = response => response.json()

export const useHistogram = corpus => {
  const { data, mutate, error, loading } = useSWR( `${ server }/histogram`, url => fetch( url, {
    headers: new Headers( {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    } ),
    method: 'POST',
    body: JSON.stringify( { histogram: { corpus } } )
  } ).then( responseToJson ) )
  return {
    histogram: data,
    mutate,
    error,
    loading
  }
}
