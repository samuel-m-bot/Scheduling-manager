import {Link} from 'react-router-dom'
import useAuth from "../../hooks/useAuth"
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { faWrench } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const WelcomeUser = () => {
    const { firstName, surname, isAdmin } = useAuth()

    const content = (
        <section className="welcome">
            <h1>Welcome {firstName} {surname}!</h1>
            
            <div className="buttonContainer_user">
                <button className="serviceButton">
                    <Link to="/home/services">
                        <FontAwesomeIcon icon={faWrench} /> Book a Service
                    </Link>
                </button>

                <button className="appointmentButton">
                    <Link to="/home/appointments">
                        <FontAwesomeIcon icon={faCalendarAlt} /> View appointments
                    </Link>
                </button>
            </div>
            
            {(isAdmin) && 
                <p><Link to="/company/users">View User Settings</Link></p>
            }
        </section>

    )

    return content
}

export default WelcomeUser