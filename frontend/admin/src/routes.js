import React from 'react'
import VerifyTicket from './views/components/verify-ticket/VerifyTicket'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Events = React.lazy(() => import('./views/components/Events/Events'))
const CreateEvent = React.lazy(() => import('./views/components/create-event/CreateEvent'))
const UpdateEvent = React.lazy(() => import('./views/components/update-event/UpdateEvent'))
const Tickets = React.lazy(() => import('./views/components/tickets/Tickets'))

const routes = [
  { path: '/organizer', exact: true, name: 'Home' },
  { path: '/organizer/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/organizer/events', name: 'Events', element: Events },
  { path: '/organizer/create-event', name: 'CreateEvent', element: CreateEvent },
  { path: '/organizer/edit/:id', name: 'UpdateEvent', element: UpdateEvent },
  { path: '/organizer/tickets', name: 'Tickets', element: Tickets },
  { path: '/organizer/verify-ticket', name: 'VerifyTicket', element: VerifyTicket },
]

export default routes
