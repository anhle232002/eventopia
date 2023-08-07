import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from 'src/libs/auth'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()
  const { data: user, isLoading } = useUser()
  console.log(user)
  if (!isLoading && !user) {
    window.open('http://google.com')

    return
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
