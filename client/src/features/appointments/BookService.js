import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectServicesById } from '../services/servicesApiSlice'
import BookServiceForm from './BookServiceForm'

const BookService = () => {
    const { id: serviceId } = useParams();

    const service = useSelector(state => selectServicesById(state, serviceId))

    const content = service ? <BookServiceForm service={service} /> : <p>Loading...</p>

    return content
}
export default BookService