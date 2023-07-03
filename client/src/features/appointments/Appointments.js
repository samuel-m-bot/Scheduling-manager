import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import appointmentsAdapter from './appointmentAdapter'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'

const Appointment= ({ appointmentId, isEdit, showOutcome}) => {
    const appointment = useSelector(state => selectAppointmentById(state, appointmentId))

    const navigate = useNavigate()

    if (appointment) {
        const handleEdit = () => navigate(`/company/appointments/${appointmentId}`)
        const handleComplete = () => navigate(`/company/appointments/complete/${appointmentId}`)
    
        let startTime = new Date(appointment.startTime);
        let endTime = new Date(appointment.endTime);
        let localeStartTimeString = startTime.toLocaleString();
        let localeEndTimeString = endTime.toLocaleString();
    
        return (
            <tr className="appointments-table__row">
                <td className='appointments-table__cell appointments-table__cell--time'>{appointment.status}</td>
                <td className='appointments-table__cell appointments-table__cell--time'>{localeStartTimeString} - {localeEndTimeString}</td>
                <td className='appointments-table__cell appointments-table__cell--user'>{appointment.user.firstName} {appointment.user.surname}</td>
                <td className='appointments-table__cell appointments-table__cell--employee'>{appointment.employee.firstName} {appointment.employee.surname}</td>
                <td className='appointments-table__cell appointments-table__cell--service'>{appointment.service.name}</td>
                {
                    isEdit && (
                        <td className='appointments-table__cell appointments-table__cell--edit'>
                            <button
                                className="appointments-table__button"
                                onClick={handleEdit}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </td>
                        
                    )
                }
                {
                    isEdit && (
                        <td className='appointments-table__cell appointments-table__cell--edit'>
                            <button
                                className="appointments-table__button"
                                onClick={handleComplete}
                            >
                                Complete service
                            </button>
                        </td>
                        
                    )
                }
                {
                    appointment.status === 'completed' && (
                        <td className='appointments-table__cell appointments-table__cell--outcome'>
                        <button
                            className="appointments-table__button"
                            onClick={() => showOutcome(appointment.outcome)}
                        >
                            View Outcome
                        </button>
                        </td>
                    )
                }
            </tr>
        )
    } else return null
    
}
export default Appointment