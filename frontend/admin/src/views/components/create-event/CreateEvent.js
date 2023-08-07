import React from 'react'
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
import { useForm } from 'react-hook-form'
import { useCreateEvent } from 'src/hooks/useCreateEvent'
import { useNavigate } from 'react-router-dom'
import { getDuration } from 'src/utils'
const CreateEvent = () => {
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  watch('isOnlineEvent')
  watch('location')

  const createEventMutation = useCreateEvent()
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    const duration = getDuration(data.duration)
    const startDate = new Date(data.startDate).getTime().toString()
    const isOnlineEvent = data.isOnlineEvent ? '1' : '0'

    await createEventMutation.mutateAsync({
      ...data,
      duration,
      startDate,
      isOnlineEvent,
    })

    navigate('/dashboard')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Create Event</strong>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={handleSubmit(onSubmit)} className="row g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="inputEmail4">Event Title</CFormLabel>
                <CFormInput
                  {...register('title', { required: true })}
                  type="text"
                  id="inputEmail4"
                />
              </CCol>
              <div className="mb-3">
                <CFormLabel>Short description</CFormLabel>
                <CFormTextarea
                  {...register('shortDescription', { required: true })}
                  rows="2"
                ></CFormTextarea>
              </div>

              <div className="mb-3">
                <CFormLabel>Description</CFormLabel>
                <CFormTextarea
                  {...register('description', { required: true })}
                  rows="6"
                ></CFormTextarea>
              </div>

              <CCol xs={6}>
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput {...register('startDate', { required: true })} type="datetime-local" />
              </CCol>

              <CCol xs={2}>
                <CFormLabel>Days</CFormLabel>
                <CFormInput
                  {...register('duration.day', { required: true })}
                  defaultValue={0}
                  min={0}
                  type="number"
                />
              </CCol>

              <CCol xs={2}>
                <CFormLabel>Hours</CFormLabel>
                <CFormInput
                  {...register('duration.hour', { required: true, min: 0 })}
                  defaultValue={0}
                  min={0}
                  type="number"
                />
              </CCol>

              <CCol xs={2}>
                <CFormLabel>Minutes</CFormLabel>
                <CFormInput
                  {...register('duration.minute', { required: true, min: 0 })}
                  defaultValue={0}
                  min={0}
                  type="number"
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel>Total Tickets</CFormLabel>
                <CFormInput
                  {...register('totalTickets', { required: true, min: 0 })}
                  type="number"
                  min={0}
                />
              </CCol>

              <CCol xs={6}>
                <CFormLabel>Ticket Price</CFormLabel>
                <CFormInput
                  {...register('ticketPrice', { required: true, min: 0 })}
                  type="number"
                  min={0}
                />
              </CCol>

              <CCol md={4}>
                <CFormLabel>City</CFormLabel>
                <CFormInput {...register('city', { required: true })} type="text" />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Country</CFormLabel>
                <CFormInput {...register('country', { required: true })} type="text" />
              </CCol>

              <CCol md={4}>
                <CFormLabel>Language</CFormLabel>
                <CFormInput {...register('language', { required: true })} type="text" />
              </CCol>

              <CCol md={4}>
                <CFormCheck
                  {...register('isOnlineEvent')}
                  id="flexCheckDefault"
                  label="Online Event?"
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel>Location</CFormLabel>
                <CFormInput {...register('location', { required: true })} type="text" />
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="formFile">Event banner</CFormLabel>
                <CFormInput
                  accept="image/*"
                  // ref={fileInputRef}
                  {...register('images', { required: true })}
                  type="file"
                  id="formFile"
                />
              </CCol>

              <CCol xs={12}>
                <CButton type="submit">Create</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateEvent
