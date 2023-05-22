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
                <p>Located in Stratford, Quick Fix repairs provides a trained staff ready to meet your car repair needs. 
                    Top automobile shop</p>
            </div>
                <address className="public__addr">
                Quick Fix repairs<br />
                    555 Foo Drive<br />
                    Foo City, CA 12345<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
                <p>Owner: Samuel Mongare</p>
            </main>
            <footer>
                <Link to="/login">Employee Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public;