import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DateTimePicker from 'react-datetime-picker'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectServicesById } from './servicesApiSlice'


const getAvailableTimeslots = async (serviceId, date) => {
    const response = await fetch(`/api/availability?serviceId=${serviceId}&date=${date.toISOString()}`)
    return response.json()
  }

const Service = ({ serviceId, isPublic }) => {
    const service = useSelector(state => selectServicesById(state, serviceId))

    const navigate = useNavigate()
    const [date, setDate] = useState(new Date())
    const [timeSlots, setTimeSlots] = useState([])

    if (service) {
        const handleEdit = () => navigate(`/company/services/${serviceId}`)

        const servicePriceString = `£${service.price.toFixed(2)}` // converts number to string with 2 decimal places and adds $ sign

        let durationHours = Math.floor(service.duration / 60)
        let durationMinutes = service.duration % 60
        const serviceDurationString = `${durationHours} hr ${durationMinutes} mins`

        const handleDateChange = async newDate => {
            setDate(newDate)

            const availableTimeslots = await getAvailableTimeslots(serviceId, newDate)
            setTimeSlots(availableTimeslots)
        }

        return (
            <div className='service__item'>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                <p><b>{serviceDurationString}</b></p>
                <p><b>{servicePriceString}</b></p>
                {isPublic ? (
                    <>
                    <DateTimePicker
                        onChange={handleDateChange}
                        value={date}
                        disableClock={true}
                        minDate={new Date()} // Prevent past date selection
                    />
                    {/* Show available time slots */}
                    {timeSlots.map((slot, index) => (
                        <button key={index} onClick={() => handleTimeSlotClick(slot)}>{formatTimeSlot(slot)}</button>
                    ))}
                    </>
                ) : (
                    <button className="icon-button table__button" onClick={handleEdit}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                )}
            </div>
        )

    } else return null
}
export default Service