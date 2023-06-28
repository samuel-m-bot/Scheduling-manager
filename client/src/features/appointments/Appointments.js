import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import appointmentsAdapter from './appointmentAdapter'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { selectAppointmentById } from './appointmentsApiSlice'

const Appointment= ({ appointmentId, isEdit}) => {
    // const state = useSelector(state => state)
    // console.log(state);
    // const adapterSelectors = appointmentsAdapter.getSelectors();
    // const mockState = {
    //     ids: ['appointment1', 'appointment2'],
    //     entities: {
    //         'appointment1': { id: 'appointment1', user: 'user1', employee: 'employee1', service: 'service1', startTime: '10:00', endTime: '11:00' },
    //         'appointment2': { id: 'appointment2', user: 'user2', employee: 'employee2', service: 'service2', startTime: '11:00', endTime: '12:00' },
    //     }
    // }
    
    
    
    // console.log(adapterSelectors.selectById(mockState, 'appointment1'));  // should log appointment1
    // console.log(adapterSelectors.selectById(mockState, 'appointment2'));  // should log appointment2
    // console.log(adapterSelectors.selectById(mockState, 'appointment3'));  // 
    // const selectAppointmentById = (state, appointmentId) => {
    //     if(state.api && state.api.queries && state.api.queries['getAppointments("appointmentsList")']) {
    //       const data = state.api.queries['getAppointments("appointmentsList")'].data;
    //       return data ? data.entities[appointmentId] : undefined;
    //     }
    //     return undefined;
    //   }
      
      
      
      // Then in your component
    //   const appointment = useSelector(state => {
    //     return selectAppointmentById(state, appointmentId);
    //   });

    console.log(appointmentId)
    const appointment = useSelector(state => selectAppointmentById(state, appointmentId))
    console.log(isEdit)
      

    const navigate = useNavigate()

    if (appointment) {
        const handleEdit = () => navigate(`/company/appointments/${appointmentId}`)
    
        let startTime = new Date(appointment.startTime);
        let endTime = new Date(appointment.endTime);
        let localeStartTimeString = startTime.toLocaleString();
        let localeEndTimeString = endTime.toLocaleString();
    
        return (
            <tr className="appointments-table__row">
                <td className='appointments-table__cell appointments-table__cell--time'>{localeStartTimeString} - {localeEndTimeString}</td>
                <td className='appointments-table__cell appointments-table__cell--user'>{appointment.user.surname}</td>
                <td className='appointments-table__cell appointments-table__cell--employee'>{appointment.employee.surname}</td>
                <td className='appointments-table__cell appointments-table__cell--service'>{appointment.service.name}</td>
                <td className='appointments-table__cell appointments-table__cell--edit'>
                {!isEdit && (
                    <button
                    className="icon-button appointments-table__button"
                    onClick={handleEdit}
                >
                    <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                )}
                </td>
            </tr>
        )
    } else return null
    
}
export default Appointment