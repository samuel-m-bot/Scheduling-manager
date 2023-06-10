import React, { useState, useEffect, useRef } from 'react';
import { useGetAvailableSlotsQuery } from './appointmentsApiSlice';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns'
import { Calendar } from 'react-date-range'
import format from 'date-fns/format';
import { eachDayOfInterval, isSunday, addMonths } from 'date-fns';
import useAuth from '../../hooks/useAuth';


const BookServiceForm = ({service}) => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateSlots, setSelectedDateSlots] = useState(null);
  const {
    data: availableSlotsData,
    error,
    isLoading,
    isError
  } = useGetAvailableSlotsQuery({ serviceId: service.id, date: selectedDate.toISOString() }, {
    skip: !service.id || !selectedDate // skip the query if `serviceId` or `selectedDate` is not defined
  })
  const { id } = useAuth()
  
  const [open, setOpen] = useState(false)
  const [serviceDuration, setServiceDuration] = useState(service.duration);
  const [calendar, setCalendar] = useState('')
  const refOne = useRef(null)

  useEffect(() =>{
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
  }, [])

  // useEffect(() => {
  //   // Set the service duration when the service data is fetched
  //   if (service) {
  //     setServiceDuration(service.duration);
  //   }
  // }, [service]);

  const hideOnEscape = (e) => {
    if( e.key === "Escape") {
        setOpen(false)
    }
  }
const threeMonthsFromNow = addMonths(new Date(), 3);
const allDates = eachDayOfInterval({
  start: new Date(),
  end: threeMonthsFromNow,
});
const disabledDates = allDates.filter(date => isSunday(date));

  const hideOnClickOutside = (e) => {
    if (refOne.current && ! refOne.current.contains(e.target)){
        setOpen(false)
    }
  }
  

// Initialize query outside of useEffect
console.log(service.id)

useEffect(() => {
  if (!selectedDate || !serviceDuration || isLoading || isError || !availableSlotsData) {
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
    const slotStart = new Date(slot.slotStart);
    const slotEnd = new Date(slot.slotEnd);

    for (let time = slotStart; time < slotEnd; time.setMinutes(time.getMinutes() + serviceDuration)) {
      const end = new Date(time.getTime());
      end.setMinutes(end.getMinutes() + serviceDuration);

      if (end <= slotEnd) {
        selectedDateSlots.slots.push({
          start: format(time, "HH:mm"),
          end: format(end, "HH:mm"),
        });
      }
    }
  });

  // Update the state with the slots of the selected date
  setSelectedDateSlots(selectedDateSlots);
}, [selectedDate, serviceDuration, availableSlotsData, isLoading, isError]);

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
    
    <div className='calendarWrap'>
        <input
        value={ calendar }
        readOnly
        className="inputBox"
        onClick={ () => setOpen(open => !open) }
      />

      <div ref={refOne}>
        {open && 
          <Calendar
            date={ new Date() }
            onChange = { handleSelect }
            className="calendarElement"
          />
        }
      </div>
      {selectedDateSlots && (
        <div>
          <h2>Available time slots for {selectedDateSlots.date}:</h2>
          {selectedDateSlots.slots.map((slot, index) => (
            <p key={index}>{slot.start} - {slot.end}</p>
          ))}
        </div>
      )}
    </div>
    );
  }

  return content;
};

export default BookServiceForm;
