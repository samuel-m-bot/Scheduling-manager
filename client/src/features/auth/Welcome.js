import {Link} from 'react-router-dom'
import useAuth from "../../hooks/useAuth"

const Welcome = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const { firstName, isAdmin, id } = useAuth()

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {firstName}!</h1>

            <p><Link to="/company/services">View available services </Link></p>

            <p><Link to="/company/appointments">View appointments</Link></p>

            {(isAdmin) && <p><Link to="/company/users">View User Settings</Link></p>}

            <p><Link to={`/company/users/${id}/availability`}>Update availability</Link></p>
        </section>
    )

    return content
}

export default Welcome