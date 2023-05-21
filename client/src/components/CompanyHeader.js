import { Link } from 'react-router-dom'

const CompanyHeader = () => {

    const content = (
        <header className="company-header">
            <div className="company-header__container">
                <Link to="/company">
                    <h1 className="company-header__title">Quick Fix repairs</h1>
                </Link>
                <nav className="company-header__nav">
                    {/* add nav buttons later */}
                </nav>
            </div>
        </header>
    )

    return content
}
export default CompanyHeader