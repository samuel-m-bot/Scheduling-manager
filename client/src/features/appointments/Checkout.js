import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAddNewAppointmentMutation } from './appointmentsApiSlice';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import './Appointments.css'


const Checkout = () => {
  <script src=''></script>
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
      <div className="appointment-confirmation">
        <h1>Appointment Confirmed!</h1>
        <p>You have booked the {service.name} service.</p>
        <p>Your appointment is on {slot.date} from {slot.start} to {slot.end}.</p>
        <button className="confirmation-button" onClick={() =>navigate('/home') }>Go back to home menu</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-details">
        <h2 className="checkout-subtitle">Appointment Details:</h2>
        <p>You have selected the <strong>{service.name}</strong> service.</p>
        <p>Your appointment is on <strong>{slot.date}</strong> from <strong>{slot.start}</strong> to <strong>{slot.end}</strong>.</p>
      </div>
      <button className="checkout-button" onClick={handleCheckout}>Confirm Appointment</button>
    </div>
  );
};

export default Checkout;
