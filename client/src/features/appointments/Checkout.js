import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAddNewAppointmentMutation } from './appointmentsApiSlice';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const { id, firstName } = useAuth()
  
  const navigate = useNavigate()
  const { slot, service } = location.state || {};

  const [addNewAppointment, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewAppointmentMutation()

  const handleCheckout = async () => {
    const [day, month, year] = slot.date.split('-').map(Number);
    const [hour, minute] = slot.start.split(':').map(Number);
  
    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + service.duration * 60000); // convert minutes to ms
  
    const startTime = startDate.toISOString();
    const endTime = endDate.toISOString();
  
    try {
      await addNewAppointment({
        user: id,
        employee: slot.employee,
        service: service.id,
        startTime: startTime,
        endTime: endTime,
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  

 
  if (!id || !slot || !service) {
    return <p>Loading...</p>;
  }

  if(isLoading) {
    return <p>Loading...</p>;
  }

  if(isError) {
    return <p>Error: {error.message}</p>;
  }

  if(isSuccess) {
    return (
      <div>
        <h1>Appointment Confirmed!</h1>
        <p>You have booked the {service.name} service.</p>
        <p>Your appointment is on {slot.date} from {slot.start} to {slot.end}.</p>
        <button onClick={() =>navigate('/home') }>Go back to home menu</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>You have selected the {service.name} service.</p>
      <p>Your appointment is on {slot.date} from {slot.start} to {slot.end}.</p>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Checkout;
