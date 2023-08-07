import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'
import { formatDate } from 'src/utils'
import { processTicket } from 'src/api/process-ticket'

function TicketInfo({ ticket, onClose }) {
  const handleClickAllowTicket = async () => {
    await processTicket(ticket.id, true)

    onClose()
  }

  const handleClickRejectTicket = async () => {
    await processTicket(ticket.id, false)

    onClose()
  }
  return (
    <CCard style={{ width: '18rem' }}>
      <CCardImage orientation="top" src={ticket.event.images[0].url} />
      <CCardBody>
        <CCardTitle>
          <span className="font-semibold me-4 col-span-2">Status:</span>
          <span
            className="col-span-10 text-left text-primary"
            style={{ textTransform: 'capitalize', fontWeight: 'bold' }}
          >
            {ticket.status}
          </span>
        </CCardTitle>
        <CCardTitle>{ticket.event.title}</CCardTitle>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">Date:</span>
          <span className="col-span-10 text-left">{formatDate(ticket.event.startDate)}</span>
        </CCardText>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">Price:</span>
          <span className="col-span-10 text-left">{ticket.price}$</span>
        </CCardText>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">Type:</span>
          <span className="col-span-10 text-left">{ticket.type}</span>
        </CCardText>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">Email:</span>
          <span className="col-span-10 text-left">{ticket.customerEmail}</span>
        </CCardText>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">Name:</span>
          <span className="col-span-10 text-left">{ticket.customerName}</span>
        </CCardText>
        <CCardText>
          <span className="font-semibold me-4 col-span-2">CID:</span>
          <span className="col-span-10 text-left">{ticket.customerCID}</span>
        </CCardText>
        <CRow className="items-center">
          <CCol md={6}>
            <CButton className="w-100 btn-danger text-white" onClick={handleClickRejectTicket}>
              Reject
            </CButton>
          </CCol>
          <CCol md={6}>
            <CButton className="w-100" onClick={handleClickAllowTicket}>
              Allow
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default TicketInfo
