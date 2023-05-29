import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectServicesById } from './servicesApiSlice'

const Service = ({ serviceId }) => {
    const service = useSelector(state => selectServicesById(state, serviceId))

    const navigate = useNavigate()

    if (service) {
        const handleEdit = () => navigate(`/company/services/${serviceId}`)

        const servicePriceString = `£${service.price.toFixed(2)}` // converts number to string with 2 decimal places and adds $ sign

        let durationHours = Math.floor(service.duration / 60)
        let durationMinutes = service.duration % 60
        const serviceDurationString = `${durationHours} hr ${durationMinutes} mins`

        return (
            <div className='service__item'>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                <p><b>{serviceDurationString}</b></p>
                <p><b>{servicePriceString}</b></p>
                <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
            </div>
        )

    } else return null
}
export default Service