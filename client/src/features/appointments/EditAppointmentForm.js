import { useState, useEffect } from "react";
import {
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAvailableSlotsQuery,
  useGetAvailableEmployeesQuery
} from "./appointmentsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import format from "date-fns/format";
import { Calendar } from "react-date-range";

const EditAppointmentForm = ({ appointment }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateSlots, setSelectedDateSlots] = useState();
  const [selectedSlot, setSelectedSlot] = useState({
    slotStart: appointment.startTime,
    slotEnd: appointment.endTime
  });
  const refOne = useRef(null);
  const [open, setOpen] = useState(true);
  const [serviceDuration, setServiceDuration] = useState(
    appointment.service.duration
  );
  const [dateSelectionOpen, setDateSelectionOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(appointment.employee);
  const [showEmployeeSelect, setShowEmployeeSelect] = useState(false);

  const [updateAppointment, { isLoading, isSuccess, isError, error }] =
    useUpdateAppointmentMutation();

  const [deleteAppointment, { isSuccess: isDelSuccess, isError: isDelError, error: delerror }] =
    useDeleteAppointmentMutation();

  const { data: availableSlotsData, error2, isLoading2, isError2 } =
    useGetAvailableSlotsQuery(
      { serviceId: appointment.service._id, date: selectedDate ? selectedDate.toISOString() : null },
      {
        skip: !appointment.service._id || !selectedDate
      }
    );

  const { data: availableEmployeesData, isLoading: isEmployeeLoading, isError: isEmployeeError } =
    useGetAvailableEmployeesQuery({
      serviceId: appointment.service._id,
      slotStart: selectedSlot.slotStart, // Changed from start to slotStart
      slotEnd: selectedSlot.slotEnd // Changed from end to slotEnd
    });

  console.log(appointment.service._id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedDate || isLoading || isError || !availableSlotsData) {
      return;
    }

    // Get the selected date in the right format (YYYY-MM-DD)
    const formattedSelectedDate = format(selectedDate, "dd-MM-yyyy");

    const availableSlots = availableSlotsData.filter(
      (slot) => format(new Date(slot.slotStart), "dd-MM-yyyy") === formattedSelectedDate
    );

    const selectedDateSlots = {
      date: formattedSelectedDate,
      slots: []
    };

    availableSlots.forEach((slot) => {
      const slotStart = format(new Date(slot.slotStart), "HH:mm");
      const slotEnd = format(new Date(slot.slotEnd), "HH:mm");

      selectedDateSlots.slots.push({
        start: slotStart,
        end: slotEnd,
        employee: slot.employee
      });
    });

    // Update the state with the slots of the selected date
    setSelectedDateSlots(selectedDateSlots);
  }, [selectedDate, availableSlotsData, isLoading2, isError2]);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate("/company/appointments");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const handleSelect = (date) => {
    if (!serviceDuration) {
      return;
    }
    // Save the selected date in state
    setSelectedDate(date);

    setDateSelectionOpen(false);
  };

  const changeEmployee = () => {
    setShowEmployeeSelect(true);
  };

  const selectNewEmployee = () => {
    const employeeSelect = document.getElementById("employeeSelect");
    const selectedId = employeeSelect.value;
    const selectedEmployeeData = availableEmployeesData.find(
      (employee) => employee._id === selectedId
    );
    setSelectedEmployee(selectedEmployeeData);
    setShowEmployeeSelect(false);
  };

  let content;

  if (isLoading2) {
    content = <p>Updating availability...</p>;
  } else if (isError2) {
    console.log(error);
    content = (
      <div>
        <h1>Error: {error.data.error}</h1>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  } else {
    content = (
      <div className="container">
        <div>
          <h2>Current Appointment Time:</h2>
          {selectedDate ? (
            <p>{format(selectedDate, "dd-MM-yyyy HH:mm")}</p>
          ) : (
            <p>Please select a new date for the appointment.</p>
          )}
          <button onClick={() => setDateSelectionOpen(true)}>Change Date</button>
          <div>
            <h2>Current Employee:</h2>
            <p>{selectedEmployee.name}</p>
            <button onClick={() => changeEmployee()}>Change Employee</button>
          </div>
        </div>

        {showEmployeeSelect && availableEmployeesData && (
          <div>
            <select id="employeeSelect">
              {availableEmployeesData.map((employee, index) => (
                <option key={index} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <button onClick={selectNewEmployee}>Select</button>
          </div>
        )}

        {dateSelectionOpen && (
          <Calendar
            date={selectedDate || new Date(appointment.startTime)}
            onChange={handleSelect}
            className="calendarElement"
            minDate={new Date()}
          />
        )}
        {selectedDateSlots && selectedDateSlots.slots.length > 0 ? (
          <div>
            <h2 className="slots-header">Available time slots for {selectedDateSlots.date}:</h2>
            <div className="time-slots-container">
              {selectedDateSlots.slots.map((slot, index) => (
                <div
                  key={index}
                  className={`slot-container ${
                    selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSlot({ ...slot, date: selectedDateSlots.date })}
                >
                  <div className="slot-item">
                    {slot.start} - {slot.end}
                  </div>
                  {selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end && (
                    <button
                      className="checkout-button"
                      onClick={() =>
                        navigate("/home/services/checkout", {
                          state: { slot: selectedSlot, service: appointment.service }
                        })
                      }
                    >
                      Checkout
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No available slots for selected date.</p>
        )}
      </div>
    );
  }

  return content;
};

export default EditAppointmentForm;
