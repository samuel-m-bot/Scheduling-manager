import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectServicesById } from './servicesApiSlice'
import EditServiceForm from './EditServiceForm'

const EditService = () => {
    const { id } = useParams()

    const service = useSelector(state => selectServicesById(state, id))

    const content = service ? <EditServiceForm service={service} /> : <p>Loading...</p>

    return content
}
export default EditService