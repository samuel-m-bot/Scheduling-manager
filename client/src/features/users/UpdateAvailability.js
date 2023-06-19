import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useUpdateAvailabilityMutation } from './usersApiSlice';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { addDays } from 'date-fns'
import { DateRange } from 'react-date-range'
import format from 'date-fns/format';
import { eachDayOfInterval, isSunday, addMonths } from 'date-fns';

const UpdateAvailability = () => {
  const { id } = useParams();
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ])
  const [open, setOpen] = useState(false)
  const refOne = useRef(null)
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [updateAvailability, { isLoading, isError, error }] = useUpdateAvailabilityMutation();

  useEffect(() =>{
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
  }, [])

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
function getHoursFromTimeString(timeString) {
  const [hours] = timeString.split(':');
  return parseInt(hours, 10);
}

function getMinutesFromTimeString(timeString) {
  const [, minutes] = timeString.split(':');
  return parseInt(minutes, 10);
}

  const handleSubmit = async (event) => {

    event.preventDefault();

    const startDate = new Date(range[0].startDate);
    const endDate = new Date(range[0].endDate);
    const availability = [];
  
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d); // Create a new Date object for the current date
  
      // Extract the date part without the time
      const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
      console.log(currentDateWithoutTime);
  
      const availabilityStartTime = new Date(currentDateWithoutTime);
      availabilityStartTime.setHours(getHoursFromTimeString(startTime), getMinutesFromTimeString(startTime), 0, 0);
  
      const availabilityEndTime = new Date(currentDateWithoutTime);
      availabilityEndTime.setHours(getHoursFromTimeString(endTime), getMinutesFromTimeString(endTime), 0, 0);
  
      availability.push({
          startTime: availabilityStartTime,
          endTime: availabilityEndTime,
      });
  }
  
  

    await updateAvailability({ id, availability });
};

  let content;

  if (isLoading) {
    content = <p>Updating availability...</p>;
  } else if (isError) {
    content = (
      <div>
        <h1>Error: {error.data.message}</h1>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  } else {
    content = (
    
    <div className='calendarWrap'>
       <input
        value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(range[0].endDate, "MM/dd/yyyy")}`}
        readOnly
        className="inputBox"
        onClick={ () => setOpen(open => !open) }
      />

      <div ref={refOne}>
        {open && 
          <DateRange
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            minDate={new Date()}
            disabledDates={disabledDates}
            direction="horizontal"
            className="calendarElement"
          />
        }
      </div>

      <div className='timeWrap'>
          <label>
              Start Time:
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          </label>
          <label>
              End Time:
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
          </label>
          <button type="submit" onClick={handleSubmit}>Update Availability</button>
      </div>
    </div>
    );
  }

  return content;
};

export default UpdateAvailability;
