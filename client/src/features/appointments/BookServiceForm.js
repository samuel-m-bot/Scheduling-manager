import React, { useState, useEffect, useRef } from 'react';
import { useGetAvailableSlotsQuery } from './appointmentsApiSlice';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns'
import { Calendar } from 'react-date-range'
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { eachDayOfInterval, isSunday, addMonths } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';


const BookServiceForm = ({service}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nextSelectedDate, setNextSelectedDate] = useState(null);
  const [selectedDateSlots, setSelectedDateSlots] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [fetchedSlots, setFetchedSlots] = useState(true)
  
  const navigate = useNavigate();
  
  const { data: availableSlotsData, error, isLoading, isError } = 
  useGetAvailableSlotsQuery(
    { serviceId: service.id, date: (selectedDate || new Date()).toISOString() }, 
    { skip: !service.id || !selectedDate }
  )

  
  const { id } = useAuth()
  
  const [open, setOpen] = useState(true)
  const [serviceDuration, setServiceDuration] = useState(service.duration);
  const [calendar, setCalendar] = useState('')
  const refOne = useRef(null)

  const threeMonthsFromNow = addMonths(new Date(), 3);
  const allDates = eachDayOfInterval({ start: new Date(), end: threeMonthsFromNow });
  const disabledDates = allDates.filter(date => isSunday(date));
  
  useEffect(() => {
    if (isLoading) return; 
    setSelectedDate(nextSelectedDate);
  }, [isLoading, nextSelectedDate]);


  useEffect(() => {
    if (!selectedDate || isLoading || isError || !availableSlotsData) {
      return;
    }

    // Get the selected date in the right format (YYYY-MM-DD)
    const formattedSelectedDate = format(selectedDate, "dd-MM-yyyy");


    const availableSlots = availableSlotsData.filter(slot =>
      format(parseISO(slot.slotStart), "dd-MM-yyyy") === formattedSelectedDate
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

  setFetchedSlots(true);

}, [availableSlotsData]);

// Adjust handleSelect
const handleSelect = (date) => {
  setFetchedSlots(false)
  if (!serviceDuration) {
    return;
  }
  setNextSelectedDate(date);
};

  let content;

  if (isLoading) {
    content = <p>Updating availability...</p>;
  } else if (isError) {
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
      {console.log(selectedDateSlots)}
      {fetchedSlots ? (
            selectedDateSlots && ( 
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
            )
        ) : (
            <p>Fetching slots...</p>
        )}

  </div>
)}
  return content;
};

export default BookServiceForm;
