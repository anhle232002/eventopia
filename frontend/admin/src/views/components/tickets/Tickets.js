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
import { useTickets } from 'src/hooks/useTickets'
import { formatDate } from 'src/utils'

const Tickets = () => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useTickets({ page })

  if (isLoading) {
    return <CSpinner />
  }
  console.log(data)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Tickets</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Event</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Event Start Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Customer name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Customer email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Customer CID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Applied Promo</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data &&
                  data.tickets &&
                  data.tickets.map((ticket, index) => {
                    return (
                      <CTableRow key={ticket.id}>
                        <CTableHeaderCell scope="row">
                          {15 * (page - 1) + index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>{ticket.event.title}</CTableDataCell>
                        <CTableDataCell>{formatDate(ticket.event.startDate)}</CTableDataCell>
                        <CTableDataCell style={{ textTransform: 'capitalize' }}>
                          {ticket.status}
                        </CTableDataCell>
                        <CTableDataCell>{ticket.type}</CTableDataCell>
                        <CTableDataCell>{ticket.customerName}</CTableDataCell>
                        <CTableDataCell>{ticket.customerEmail}</CTableDataCell>
                        <CTableDataCell>{ticket.customerCID}</CTableDataCell>
                        <CTableDataCell>{formatDate(ticket.createdAt)}</CTableDataCell>
                        <CTableDataCell>{ticket.promoId ? 'Yes' : 'No'}</CTableDataCell>
                      </CTableRow>
                    )
                  })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>

        <CPagination>
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

export default Tickets
