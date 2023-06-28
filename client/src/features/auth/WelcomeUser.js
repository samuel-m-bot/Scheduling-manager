import {Link} from 'react-router-dom'
import useAuth from "../../hooks/useAuth"

const WelcomeUser = () => {
    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const { firstName, surname, isAdmin } = useAuth()

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {firstName} {surname}!</h1>

            <p><Link to="/home/services">Book a Service </Link></p>

            <p><Link to="/home/appointments">View appointments</Link></p>

            {(isAdmin) && <p><Link to="/company/users">View User Settings</Link></p>}

        </section>
    )

    return content
}

export default WelcomeUser