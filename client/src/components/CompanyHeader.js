import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const COMPANY_REGEX = /^\/company(\/)?$/
const NOTES_REGEX = /^\/company\/notes(\/)?$/
const USERS_REGEX = /^\/company\/users(\/)?$/

const CompanyHeader = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/employeeLogin')
    }, [isSuccess, navigate])

    if (isLoading) return <p>Logging Out...</p>

    if (isError) return <p>Error: {error.data?.message}</p>

    let companyClass = null
    if (!COMPANY_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
        companyClass = "company-header__container--small"
    }

    const logoutButton = (
        <button
            className="icon-button logout-button"
            title="Logout"
            onClick={sendLogout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Logout</span>
        </button>
    )

    const content = (
        <header className="company-header">
            <div className={`company-header__container ${companyClass}`}>
                <Link to="/company">
                    <h1 className="company-header__title">Quick Fix</h1>
                </Link>
                <nav className="company-header__nav">
                    {/* add more buttons later */}
                    {logoutButton}
                </nav>
            </div>
        </header>
    )

    return content
}
export default CompanyHeader