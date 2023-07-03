import React from 'react'
import { useUpdateAppointmentMutation } from './appointmentsApiSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteAppointmentForm = ({appointment}) => {


    const [outcome, setOutcome] = useState("")
    const [updateAppointment, { isLoading, isSuccess, isError, error }] =
    useUpdateAppointmentMutation();

    const navigate = useNavigate()

    const onOutcomeChanged = e => setOutcome(e.target.value)
    const onCompleteAppointmentClicked = async () => {
        if (outcome !== "") {
          await updateAppointment({
            id: appointment._id,
            user: appointment.user,
            employee: appointment.employee,
            service: appointment.service,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            status: 'completed', 
            outcome: outcome 
          })
        }
    }
    
    let content = (
        <div>
            <form className="appointment-form">
                <h1 className="appointment-form__title">Complete Appointment Form for {appointment.user.firstName} {appointment.user.surname}</h1>
                <h3 className="appointment-form__subtitle">Service: {appointment.service.name}</h3>
                <label className="appointment-form__label" htmlFor='outcome'>Outcome</label>
                <textarea
                    id="outcome"
                    name="outcome"
                    autoComplete="off"
                    rows={30}
                    cols={10}
                    placeholder='Outcome of service'
                    value={outcome}
                    onChange={onOutcomeChanged}
                    className="appointment-form__textarea"
                />
                <button className="appointment-form__button" onClick={onCompleteAppointmentClicked}>Complete Appointment</button>
            </form>
        </div>
    )

    if(isLoading){
        content = (
            <p>Loading Complete appointment form</p>
        )
    }
    if(isError){
        content = (
            <div>
              <h1>Error: {error.data.error}</h1>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        )
    }
    if(isSuccess){
        content =(
            <div>
                <p>Successfully completed appointment</p>
                <button onClick={() => navigate('/company/appointments')}>Go back List</button>
            </div>
            
        )
    }

    return content;
}

export default CompleteAppointmentForm