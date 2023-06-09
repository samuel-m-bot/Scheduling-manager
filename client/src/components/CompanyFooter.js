import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from "../hooks/useAuth"

const CompanyFooter = () => {

    const { firstName, surname, status } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => navigate('/company')

    let goHomeButton = null
    if (pathname !== '/company') {
        goHomeButton = (
            <button
                className="company-footer__button icon-button"
                title="Home"
                onClick={onGoHomeClicked}
            >
                <FontAwesomeIcon icon={faHouse} />
            </button>
        )
    }

    const content = (
        <footer className="company-footer">
            {goHomeButton}
            <p>Current User: {firstName} {surname} </p>
            <p>Status: {status} </p>
        </footer>
    )
    return content
}
export default CompanyFooter