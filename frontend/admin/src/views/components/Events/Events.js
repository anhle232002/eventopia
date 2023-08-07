import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CPagination,
  CPaginationItem,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from 'src/hooks/useEvents'
import { useUser } from 'src/libs/auth'
import { formatDate } from 'src/utils/formatDate'

const Events = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useEvents({ page })

  if (isLoading) {
    return <CSpinner />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Events</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Online</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total Tickets</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Attendee</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Likes</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data &&
                  data.events &&
                  data.events.map((event, index) => {
                    const status = new Date(event.startDate) < new Date() ? 'Ended' : 'Upcoming'
                    return (
                      <CTableRow key={event.id}>
                        <CTableHeaderCell scope="row">
                          {15 * (page - 1) + index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>{event.title}</CTableDataCell>
                        <CTableDataCell>{status}</CTableDataCell>
                        <CTableDataCell>{event.isOnlineEvent ? 'True' : 'False'}</CTableDataCell>
                        <CTableDataCell>{event.location}</CTableDataCell>
                        <CTableDataCell>{formatDate(event.startDate)}</CTableDataCell>
                        <CTableDataCell>{event.totalTickets}</CTableDataCell>
                        <CTableDataCell>{event.sold}</CTableDataCell>
                        <CTableDataCell>{event._count.looks}</CTableDataCell>
                        <CTableDataCell>
                          <Link to={`/organizer/edit/${event.id}`} className="btn btn-primary">
                            Edit
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
        <CPagination aria-label="Page navigation example">
          <CPaginationItem
            onClick={() => {
              if (page <= 1) return
              setPage(page - 1)
            }}
          >
            Previous
          </CPaginationItem>
          <CPaginationItem
            onClick={() => {
              if (page >= Math.ceil(data.total / 10)) return
              setPage(page + 1)
            }}
          >
            Next
          </CPaginationItem>
        </CPagination>
      </CCol>
    </CRow>
  )
}

export default Events
