import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'
import EditAppointmentForm from './EditAppointmentForm'

const EditAppointment = () => {
    const { id } = useParams()

    const appointment = useSelector(state => selectAppointmentById(state, id))
    
    const content = appointment ? <EditAppointmentForm appointment={appointment} /> : <p>Loading...</p>

    return content
}

export default EditAppointment
