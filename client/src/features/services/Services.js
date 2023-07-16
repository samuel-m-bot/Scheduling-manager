import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DateTimePicker from 'react-datetime-picker'
import { faPenToSquare, faCalendarDay } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectServicesById } from './servicesApiSlice'
import fullCarServiceImage from './service_img/full-car-service.jpg';
import bookMotImg from './service_img/book-mot.jpg'
import airConditioningServiceImg from './service_img/air-conditioning-service.jpg'
import oilChangeServiceImg from './service_img/oil-change-service.jpg'
import brakeServiceImg from './service_img/brake-service.jpg'
import alignmentServiceImg from './service_img/alignment-service.jpg'


const getAvailableTimeslots = async (serviceId, date) => {
    const response = await fetch(`/api/availability?serviceId=${serviceId}&date=${date.toISOString()}`)
    return response.json()
  }

const Service = ({ serviceId, isEdit, isBook }) => {
    console.log('Rendering Services component for serviceId:', serviceId);
    const service = useSelector(state => selectServicesById(state, serviceId))

    const navigate = useNavigate()
    const [date, setDate] = useState(new Date())
    const [timeSlots, setTimeSlots] = useState([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

    if (service) {
        const handleEdit = () => navigate(`/company/services/${serviceId}`)
        const handleBook = () => navigate(`/home/services/${serviceId}`)

        const servicePriceString = `£${service.price.toFixed(2)}` // converts number to string with 2 decimal places and adds $ sign

        let durationHours = Math.floor(service.duration / 60)
        let durationMinutes = service.duration % 60
        const serviceDurationString = `${durationHours} hr ${durationMinutes} mins`

        const handleDateChange = async newDate => {
            setDate(newDate)

            const availableTimeslots = await getAvailableTimeslots(serviceId, newDate)
            setTimeSlots(availableTimeslots)
        }
        function formatTimeSlot(slot) {
            return `${slot.startTime.toLocaleTimeString()} - ${slot.endTime.toLocaleTimeString()}`;
        }

        function handleTimeSlotClick(slot) {
            setSelectedTimeSlot(slot);
        }
        function toKebabCase(str) {
            return str.replace(/\s+/g, '-').toLowerCase();
        }
        

        const serviceImages = {
            'Full Car Service': fullCarServiceImage,
            'Book MOT': bookMotImg,
            'Air Conditioning Service': airConditioningServiceImg,
            'Oil Change Service': oilChangeServiceImg,
            'Alignment Service': alignmentServiceImg,
            'Brake Service': brakeServiceImg
            // ...
          };

        return (
            <div className={`service__item service__item__${toKebabCase(service.name)}`}>
                <img src={serviceImages[service.name]} alt={service.name} className="service__item__image" />
                <div className="service__item__content">
                    <h2>{service.name}</h2>
                    <p>{service.description}</p>
                    {(isBook || isEdit) && (
                    <div>
                        <p><b>{serviceDurationString}</b></p>
                        <p><b>{servicePriceString}</b></p>
                    </div>
                    )}
                    {isBook && (
                    <button className="icon-button table__button" onClick={handleBook}>
                        <FontAwesomeIcon icon={faCalendarDay} />
                        <span>Book Service</span>
                    </button>
                    )}
                    {isEdit && (
                        <button className="icon-button table__button" onClick={handleEdit}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                    )}
                </div>
            </div>
        )

    } else return null
}
export default Service