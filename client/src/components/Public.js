import {Link} from 'react-router-dom'
import useAuth from "../hooks/useAuth"
import ServicesList from '../features/services/ServicesList'  
import { useSelector } from 'react-redux';  
import LoadingSpinner from './LoadingSpinner';
import ChatBox from '../features/chat/ChatBox';
import './Public.css'

const Public = () => {
    const {  role } = useAuth()
    const isLoggingOut = useSelector((state) => state.auth.isLoggingOut);

    if (isLoggingOut) {
      return <LoadingSpinner />;
    }
    const content = (
        <section className="public">
            <header className='public__header'>
            <nav class="nav-bar">
                <div class="nav-section left">
                <Link to="/"><h1>Quick Fix</h1></Link>
                </div>
                <div class="nav-section center">
                    <Link to="/about">About</Link>
                </div>
                <div class="nav-section right">
                    <select id="language-selector">
                        <option value="english" selected>English</option>
                        <option value="spanish">Español</option>
                        <option value="french">Français</option>
                    </select>
                </div>
            </nav>
            </header>
            <main className="public__main">
            <div className="image-text">
                <h1>Automobile Repair Shop</h1>
                <p>Located in Canary Wharf, Quick Fix repairs provides a trained staff ready to meet your car repair needs. 
                    Top automobile shop</p>
            </div>
            <div className='public__service' id='content"'>
                <h1 className='Services_title'>Services</h1>
                {(role=='') && <Link to="/userLogin">
                                    <button type="button" className="button button-login">
                                        Login to book a service
                                    </button>
                                </Link>}
                                {(role=='') &&<Link to="/userRegister">
                                    <button type="button" className="button button-register">
                                        Register to book a service
                                    </button>
                                </Link>}
                                <ServicesList isEdit={false} isBook={false} />  {/* use ServicesList component */}
            </div>
            <div className='public__companyInfo'>
            <address className="public__addr">
                Quick Fix<br />
                25 Cabot Square<br />
                Canary Wharf, London, E14 4QA<br />
                    <a href="tel:+4420 7425 8000">020 7425 8000</a>
                </address>
                <br />
                <p>Owner: Samuel Mongare</p>
            </div>
            <div>
                {<ChatBox/>}
            </div>
            </main>
            <footer>
                <Link to="/employeeLogin">Employee Login</Link>
            </footer>
        </section>
 
    )
    return content
}
export default Public;