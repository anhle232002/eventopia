import { useMutation, useQuery } from '@tanstack/react-query'
import { getUser } from 'src/api/get-user'
import { logout } from 'src/api/logout'
import { queryClient } from './query-client'

async function loadUser() {
  try {
    const data = await getUser()

    return data
  } catch (error) {
    console.log(error)
  }

  return null
}

export const useUser = () => {
  return useQuery({
    queryFn: loadUser,
    queryKey: ['auth', 'user'],
    useErrorBoundary: true,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess() {
      queryClient.setQueryData(['auth', 'user'], null)
    },
  })
}
