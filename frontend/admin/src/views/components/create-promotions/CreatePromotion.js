import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreatePromo } from 'src/hooks/useCreatePromo'
import { useEvents } from 'src/hooks/useEvents'

function CreatePromotion() {
  const { data, isLoading } = useEvents({ status: 'upcoming' })
  const createPromoMutation = useCreatePromo()
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    data.events = data.events.map((e) => parseInt(e))
    try {
      await createPromoMutation.mutateAsync(data)

      window.open('/organizer/dashboard', '_self')
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create Promotion code</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CCol className="mb-3">
                <CFormLabel htmlFor="exampleFormControlInput1">Promotion CODE</CFormLabel>
                <CFormInput type="text" {...register('code', { required: true })} />
              </CCol>
              <CRow>
                <CCol xs={6}>
                  <CFormLabel>Valid from</CFormLabel>
                  <CFormInput
                    {...register('validFrom', { required: true })}
                    type="datetime-local"
                  />
                </CCol>

                <CCol xs={6}>
                  <CFormLabel>Valid until</CFormLabel>
                  <CFormInput
                    {...register('validUntil', { required: true })}
                    type="datetime-local"
                  />
                </CCol>
              </CRow>

              <CRow className="mt-5">
                <CCol xs={4} className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Type</CFormLabel>
                  <CFormSelect {...register('type', { required: true })}>
                    <option value="percentage">Percentage</option>
                    <option value="fix">Fix</option>
                  </CFormSelect>
                </CCol>
                <CCol xs={4} className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Discount</CFormLabel>
                  <CFormInput
                    {...register('discount', { required: true })}
                    min={0}
                    defaultValue={0}
                    type="number"
                  />
                </CCol>

                <CCol xs={4} className="mb-3">
                  <CFormLabel htmlFor="exampleFormControlInput1">Total Avaibablity</CFormLabel>
                  <CFormInput
                    {...register('total', { required: true })}
                    min={0}
                    defaultValue={0}
                    type="number"
                  />
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CFormLabel>Events to apply</CFormLabel>
                {data &&
                  data.events &&
                  data.events.map((event) => {
                    return (
                      <CCol md={3} key={event.id}>
                        <CFormCheck
                          {...register('events', { required: true })}
                          value={event.id}
                          label={event.title}
                        />
                      </CCol>
                    )
                  })}
              </CRow>

              <CCol className="mt-4">
                <CButton type="submit">Create</CButton>
              </CCol>

              {error && (
                <CCol className="mt-4 text-warning">
                  <div>{error[0] || error}</div>
                </CCol>
              )}
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreatePromotion
