import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faCalendar, faUserCog, faClock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import useAuth from "../../hooks/useAuth";

const Welcome = () => {
    const { firstName, isAdmin, id } = useAuth();

    const content = (
        
        <section className="welcome">
            <h1>Welcome {firstName}!</h1>
                {isAdmin ? (
                <div className="buttonContainer">
                    <Link to="/company/services">
                        <div className="grid-item serviceButton2">
                            <FontAwesomeIcon icon={faBuilding} />
                            View available services
                        </div>
                    </Link>
                    <Link to="/company/appointments">
                        <div className="grid-item appointmentButton2">
                            <FontAwesomeIcon icon={faCalendar} />View appointments
                        </div>
                    </Link>
                    <Link to="/company/users">
                        <div className="grid-item serviceButton2">
                            <FontAwesomeIcon icon={faUserCog} />View User Settings
                        </div>
                    </Link>
                    <Link to={`/company/users/${id}/updateAvailability`}>
                        <div className="grid-item appointmentButton2">
                            <FontAwesomeIcon icon={faClock} />Update availability
                        </div>
                    </Link>
                    <div className="grid-item span-two-columns-always serviceButton2">
                        <Link to={`/company/users/${id}/viewAvailability`}>
                            <FontAwesomeIcon icon={faInfoCircle} />View availability
                        </Link>
                    </div>
                </div>
                ) : (
                    <div className="buttonContainer">
                        <Link to="/company/services">
                            <div className="grid-item serviceButton2">
                            <FontAwesomeIcon icon={faBuilding} />View available services
                            </div>
                        </Link>
                        <Link to="/company/appointments">
                            <div className="grid-item appointmentButton2">
                                <FontAwesomeIcon icon={faCalendar} />View appointments
                            </div>
                        </Link>
                        <Link to={`/company/users/${id}/updateAvailability`}>
                            <div className="grid-item appointmentButton2">
                                <FontAwesomeIcon icon={faClock} />Update availability
                            </div>
                        </Link>
                        <Link to={`/company/users/${id}/viewAvailability`}>
                            <div className="grid-item span-two-columns serviceButton2">
                                <FontAwesomeIcon icon={faInfoCircle} />View availability
                            </div>
                        </Link>
                    </div>
                )}
        </section>
    )

    return content
}

export default Welcome;
