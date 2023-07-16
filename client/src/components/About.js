import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <section>
        <header className='public__header'>
            <nav class="nav-bar">
                <div class="nav-section left">
                    <Link to="/"><h1>Quick Fix</h1></Link>
                </div>
                <div class="nav-section center">
                    <Link to="/">Home</Link>
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
        <div class="aboutContainer">
                <div class="aboutBox aboutHeader">
                    <h2>About Us</h2>
                    <p>Welcome to our Auto Repair Shop, where we've been ensuring exceptional service for our customers for over 20 years. We are more than just an automotive repair shop; we are a trusted partner in keeping your vehicle safe and efficient on the road.
                    Our journey began in 2003 with a mission to provide top-notch service to our community, filling the void for a reliable, trustworthy, and customer-oriented automobile repair shop. Since then, we've been delivering high-quality services that match dealership standards but at a fraction of the cost.
                    As an independently owned business, we offer an unparalleled customer experience. We understand how crucial your vehicle is to your day-to-day life and are committed to getting you back on the road safely and swiftly.</p>
                </div>

                <div class="aboutBox">
                    <h2>Our Expertise</h2>
                    <p>Our team consists of highly skilled, certified professionals with extensive industry experience. From routine maintenance to major repairs, our expert technicians have the skills and the know-how to service any make or model. We stay up-to-date with the latest trends, techniques, and tools in the auto repair industry to offer you the most innovative solutions.</p>
                </div>

                <div class="aboutBox">
                    <h2>Our Services</h2>
                    <p>We offer a wide range of services, including but not limited to, routine maintenance, engine diagnostics, tire services, brake repairs, AC services, transmission repairs, and much more. Our approach is preventative; we aim to spot potential issues before they turn into costly repairs.</p>
                </div>

                <div class="aboutBox">
                    <h2>Our Commitment</h2>
                    <p>Trust, transparency, and high-quality service are our core values. We strive to provide a detailed explanation of the issues, the proposed solutions, and a comprehensive estimate before we begin any work. We believe in no surprises when it comes to your bill.</p>
                </div>

                <div class="aboutBox">
                    <h2>Our Vision</h2>
                    <p>Our vision is to continue being a trusted partner for automobile repair and maintenance in our community. We're committed to innovation, customer satisfaction, and providing the highest quality service possible. We look forward to serving you and your vehicle's needs now and for years to come.</p>
                </div>
            </div>
        </main>
    </section>
  )
}

export default About