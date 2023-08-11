import React, { useEffect, useState } from 'react'
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
  CSpinner,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useUpdateEvent } from 'src/hooks/useUpdateEvent'
import { useNavigate, useParams } from 'react-router-dom'
import { getDuration, parseTime } from 'src/utils'
import { useEvent } from 'src/hooks/useEvent'
const CreateEvent = () => {
  const params = useParams()
  const { data: event, isLoading } = useEvent(Number(params.id))
  const [selectedImage, setSelectedImage] = useState(null)
  const {
    register,
    getValues,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { dirtyFields },
  } = useForm({})
  watch('isOnlineEvent')
  watch('location')

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate).toISOString().slice(0, 16)
      const duration = parseTime(event.duration)
      reset({ ...event, startDate, duration, images: null })
    }
  }, [event, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      setValue('removedImages', [event.images[0].publicId])
      setSelectedImage(e.target?.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const updateEventMutation = useUpdateEvent()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const updatedFields = Object.keys(dirtyFields).reduce((acc, key) => {
      return { ...acc, [key]: data[key] }
    }, {})

    if (updatedFields.duration) {
      updatedFields.duration = getDuration(data.duration)
    }

    if (updatedFields.startDate) {
      updatedFields.startDate = new Date(data.startDate).getTime().toString()
    }
    if (updatedFields.isOnlineEvent) {
      updatedFields.isOnlineEvent = data.isOnlineEvent ? '1' : '0'
    }

    // console.log({
    //   ...updatedFields,
    //   eventId: event.id,
    //   removedImages: data.removedImages || undefined,
    //   images: data.images || undefined,
    // })

    await updateEventMutation.mutateAsync({
      ...updatedFields,
      eventId: event.id,
      removedImages: data.removedImages || undefined,
      images: data.images || undefined,
    })

    navigate('/dashboard')
  }

  if (isLoading) {
    return <CSpinner></CSpinner>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Update Event</strong>
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
                <CFormInput
                  defaultValue={0}
                  {...register('startDate', { required: true })}
                  type="datetime-local"
                />
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

              <CCol className="mt-5">
                <img width={500} alt="banner" src={selectedImage || event.images[0].url}></img>
              </CCol>

              <CCol md={12} className="mb-3">
                <CFormLabel htmlFor="formFile">Event banner</CFormLabel>
                <CFormInput
                  accept="image/*"
                  // ref={fileInputRef}
                  onChangeCapture={handleImageChange}
                  {...register('images')}
                  type="file"
                  id="formFile"
                />
              </CCol>

              <CCol xs={12}>
                <CButton type="submit">Edit</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateEvent
