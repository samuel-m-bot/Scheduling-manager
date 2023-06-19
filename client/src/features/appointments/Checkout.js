import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAddNewAppointmentMutation } from './appointmentsApiSlice';
import useAuth from '../../hooks/useAuth';

const Checkout = () => {
  const location = useLocation();
  const { id } = useAuth()
  const { slot, service } = location.state;

  const [addNewAppointment, {
    isLoading,
    isSuccess,
    isError,
    error
}] = useAddNewAppointmentMutation()

  const handelSubmit = async() => {
    await addNewAppointment({ id})
  }
  console.log(slot.employee)
  return (
    <div>
      <h1>Checkout</h1>
      <p>You have selected the {service.name} service.</p>
      <p>Your appointment is on {slot.date} from {slot.start} to {slot.end}.</p>
      <button onSubmit={handelSubmit}>CheckOut</button>
      {/* You can add the rest of your checkout process here. */}
    </div>
  );
};

export default Checkout;
