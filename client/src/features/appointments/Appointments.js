import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'

const Appointment= ({ appointmentId }) => {
    const appointment = useSelector(state => selectAppointmentById(state, appointmentId))

    const navigate = useNavigate()

    if (appointment) {
        const handleEdit = () => navigate(`/company/appointments/${appointmentId}`)

        let appointmentTime = new Date(appointment.appointmentTime);
        let localeTimeString = appointmentTime.toLocaleString();

        return (
            <tr className="table__row user">
                <td className='table__cell'>{localeTimeString}</td>
                <td className='table__cell'>{appointment.user.surname}</td>
                <td className='table__cell'>{appointment.employee.surname}</td>
                <td className='table__cell'>{appointment.employee.surname}</td>
                <td className='table__cell'>{appointment.service.name}</td>
                <td className='table__cell'>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )

    } else return null
}
export default Appointment