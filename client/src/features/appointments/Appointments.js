import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import appointmentsAdapter from './appointmentAdapter'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'
import { useDeleteAppointmentMutation } from './appointmentsApiSlice'
import useAuth from '../../hooks/useAuth'

const Appointment= ({ appointmentId, isEdit, showOutcome}) => {
    const appointment = useSelector(state => selectAppointmentById(state, appointmentId))

    const { role } = useAuth()

    const navigate = useNavigate()
    const [deleteAppointment, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteAppointmentMutation()

    if (appointment) {
        const handleEdit = () => navigate(`/company/appointments/${appointmentId}`)
        const handleComplete = () => navigate(`/company/appointments/complete/${appointmentId}`)
        const onDeleteAppointmentClicked = async () => {
            await deleteAppointment({ id: appointment.id })
            if(role=="user") navigate('/home/appointments')
            else navigate('/company/appointment')
            
        }
    
        let startTime = new Date(appointment.startTime);
        let endTime = new Date(appointment.endTime);

        let day = startTime.getDate().toString().padStart(2, '0');
        let month = (startTime.getMonth() + 1).toString().padStart(2, '0');  // Months are zero-based in JavaScript
        let year = startTime.getFullYear();


        let hours = startTime.getHours().toString().padStart(2, '0');
        let minutes = startTime.getMinutes().toString().padStart(2, '0');

        let localeStartTimeString = `${day}/${month}/${year} - ${hours}:${minutes}`;


        hours = endTime.getHours().toString().padStart(2, '0');
        minutes = endTime.getMinutes().toString().padStart(2, '0');
        let localeEndTimeString = `${hours}:${minutes}`;
    
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
                {appointment.status != 'completed' && (
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
                )}
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
                {appointment.status != 'completed' && (
                            <td className='appointments-table__cell appointments-table__cell--edit'>
                                <button
                                    className="appointments-table__button"
                                    onClick={onDeleteAppointmentClicked}
                                >
                                    Cancel appointment 
                                </button>
                            </td>
                )}
                
            </tr>
        )
    } else return null
    
}
export default Appointment