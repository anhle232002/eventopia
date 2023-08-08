import React, { useState } from 'react'
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
import { usePromotions } from 'src/hooks/usePromotions'
import { formatDate } from 'src/utils'
function Promotions() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = usePromotions({ page })
  console.log(data)
  if (isLoading) {
    return <CSpinner></CSpinner>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Promotions</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valid from</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Valid until</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Discount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Avaibablity</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Used</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Applied events</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Apply All</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data &&
                  data.promos &&
                  data.promos.map((promo, index) => {
                    console.log(promo)
                    return (
                      <CTableRow key={promo.id}>
                        <CTableHeaderCell scope="row">
                          {15 * (page - 1) + index + 1}
                        </CTableHeaderCell>
                        <CTableDataCell>{promo.code}</CTableDataCell>
                        <CTableDataCell>{promo.status}</CTableDataCell>
                        <CTableDataCell>{formatDate(promo.validFrom)}</CTableDataCell>
                        <CTableDataCell>{formatDate(promo.validUntil)}</CTableDataCell>
                        <CTableDataCell>{promo.type}</CTableDataCell>
                        <CTableDataCell>{promo.discount}</CTableDataCell>
                        <CTableDataCell>{promo.total}</CTableDataCell>
                        <CTableDataCell>{promo.used}</CTableDataCell>
                        <CTableDataCell>{0}</CTableDataCell>
                        <CTableDataCell>{promo.applyAll ? 'Yes' : 'No'}</CTableDataCell>
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

export default Promotions
