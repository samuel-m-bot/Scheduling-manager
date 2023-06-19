import React, { useState, useEffect, useRef } from 'react';
import { useGetAvailableSlotsQuery } from './appointmentsApiSlice';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns'
import { Calendar } from 'react-date-range'
import format from 'date-fns/format';
import { eachDayOfInterval, isSunday, addMonths } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const BookServiceForm = ({service}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateSlots, setSelectedDateSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();
  const {
    data: availableSlotsData,
    error,
    isLoading,
    isError
  } = useGetAvailableSlotsQuery({ serviceId: service.id, date: selectedDate.toISOString() }, {
    skip: !service.id || !selectedDate // skip the query if `serviceId` or `selectedDate` is not defined
  })
  const { id } = useAuth()
  
  const [open, setOpen] = useState(true)
  const [serviceDuration, setServiceDuration] = useState(service.duration);
  const [calendar, setCalendar] = useState('')
  const refOne = useRef(null)

  // useEffect(() => {
  //   // Set the service duration when the service data is fetched
  //   if (service) {
  //     setServiceDuration(service.duration);
  //   }
  // }, [service]);


const threeMonthsFromNow = addMonths(new Date(), 3);
const allDates = eachDayOfInterval({
  start: new Date(),
  end: threeMonthsFromNow,
});
const disabledDates = allDates.filter(date => isSunday(date));

  

// Initialize query outside of useEffect
console.log(service.id)

useEffect(() => {
  if (!selectedDate || isLoading || isError || !availableSlotsData) {
    return;
  }

  // Get the selected date in the right format (YYYY-MM-DD)
  const formattedSelectedDate = format(selectedDate, "dd-MM-yyyy");

  const availableSlots = availableSlotsData.filter(slot =>
    format(new Date(slot.slotStart), "dd-MM-yyyy") === formattedSelectedDate
  );

  const selectedDateSlots = {
    date: formattedSelectedDate,
    slots: [],
  };

  availableSlots.forEach(slot => {
    const slotStart = format(new Date(slot.slotStart), "HH:mm");
    const slotEnd = format(new Date(slot.slotEnd), "HH:mm");

    selectedDateSlots.slots.push({
      start: slotStart,
      end: slotEnd,
      employee: slot.employee, 
    });
  });

  // Update the state with the slots of the selected date
  setSelectedDateSlots(selectedDateSlots);
}, [selectedDate, availableSlotsData, isLoading, isError]);

// Adjust handleSelect
const handleSelect = (date) => {
  if (!serviceDuration) {
    return;
  }
  // Save the selected date in state
  setSelectedDate(date);
};

  let content;

  if (isLoading) {
    content = <p>Updating availability...</p>;
  } else if (isError) {
    console.log(error)
    content = (
      <div>
        <h1>Error: {error.data.error}</h1>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  } else {
    content = (
    
    <div className="container">

      <div ref={refOne}>
        {open && 
          <Calendar
            date={selectedDate}
            onChange = { handleSelect }
            className="calendarElement"
            minDate={new Date()}
          />
        }
      </div>
      {selectedDateSlots && (
        selectedDateSlots.slots.length > 0 ? (
          <div>
            <h2 className="slots-header">Available time slots for {selectedDateSlots.date}:</h2>
            <div className="time-slots-container">
              {selectedDateSlots.slots.map((slot, index) => (
                <div key={index} 
                className={`slot-container ${selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot({...slot, date: selectedDateSlots.date})}>
                  <div className="slot-item">{slot.start} - {slot.end}</div>
                  {selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end && 
                  <button className="checkout-button"
                    onClick={() => navigate('/home/services/checkout', { state: { slot: selectedSlot, service: service }})}
                  >Checkout
                  </button>}
                </div>
              ))
              }
            </div>
          </div>
        ) : (
          <p>No available slots for selected date.</p>
        )
      )}
  </div>
)}
  return content;
};

export default BookServiceForm;
