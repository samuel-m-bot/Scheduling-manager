import React from 'react'
import CompleteAppointmentForm from './CompleteAppointmentForm'
import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'
import { useParams } from 'react-router-dom'

const CompleteAppointment = () => {
  const { id } = useParams()

  const appointment = useSelector(state => selectAppointmentById(state, id))
  
  const content = appointment ? <CompleteAppointmentForm appointment={appointment} /> : <p>Loading...</p>

  return content
}

export default CompleteAppointment