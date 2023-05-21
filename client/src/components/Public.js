import {Link} from 'react-router-dom'

const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">Quick Fix repairs</span></h1>
            </header>
            <main className="public__main">
                <p>Located in Stratford, Quick Fix repairs provides a trained staff ready to meet your car repair needs.</p>
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