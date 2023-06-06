import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"

const HomeFooter = () => {

    const { firstName, surname, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/home')

    let goHomeButton = null
    if (pathname !== '/home') {
        goHomeButton = (
            <button
                className="home-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="home-footer">
            {goHomeButton}
            <p>Current User: {firstName} {surname} </p>
            <p>Status: {status} </p>
        </footer>
    )
    return content
}
export default HomeFooter