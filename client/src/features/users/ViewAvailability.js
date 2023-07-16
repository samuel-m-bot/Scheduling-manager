import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { selectUserById } from "./usersApiSlice";
import { useDeleteAvailabilityMutation } from "./usersApiSlice";

const localizer = momentLocalizer(moment)

const ViewAvailability = () => {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));
  const [events, setEvents] = useState([]);

  const [deleteAvailability, { isLoading: deletingAvailability }] = useDeleteAvailabilityMutation()

  const handleEventClick = async (event) => {
    if (window.confirm('Do you really want to delete this availability slot?')) {
      await deleteAvailability({
        id: user.id,
        availability: {
          startTime: event.start,
          endTime: event.end
        },
      });
    }
  };
  
  

  useEffect(() => {
    if (user && user.availability) {
      const availabilityEvents = user.availability.map((slot, index) => {
        return {
          id: index,
          title: `Availability slot ${index + 1}`,
          start: new Date(slot.startTime),
          end: new Date(slot.endTime),
          allDay: false,
        };
      });
      setEvents(availabilityEvents);
    }
  }, [user]);

  if (!events.length) {
    return <p>No Availability</p>;
  }

  return (
    <div style={{ height: "500px" }}>
      <h1>Availability for {user.firstName} {user.surname}</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleEventClick}
      />
    </div>
  );
};

export default ViewAvailability;
