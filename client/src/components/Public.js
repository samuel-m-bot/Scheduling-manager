import {Link} from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header className='public__header'>
            <nav class="nav-bar">
                <div class="nav-section left">
                    <h1>Quick Fix</h1>
                </div>
                <div class="nav-section center">
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
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
            <div className='public__service'>
                <h1>Services</h1>
                <div className='service__container'>
                    <div className='service__item'>
                        <h2>FULL CAR SERVICE</h2>
                    </div>
                    <div className='service__item'>
                        <h2>Book MOT</h2>
                    </div>
                    <div className='service__item'>
                        <h2>Air Conditioning</h2>
                    </div>
                    <div className='service__item'>
                        <h2>Oil Change</h2>
                    </div>
                    <div className='service__item'>
                        <h2>Alignment</h2>
                    </div>
                    <div className='service__item'>
                        <h2>Brake Service</h2>
                    </div>
                </div>
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
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public;