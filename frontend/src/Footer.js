import './Footer.css';

function Footer() {
    return (
        <div className="footer-container" id="footer">
            <div className="waves">
                <div class="wave" id="wave1"></div>
                <div class="wave" id="wave2"></div>
                <div class="wave" id="wave3"></div>
                <div class="wave" id="wave4"></div>
            </div>
            <ul className="social-icon">
                <li><a href="https://www.facebook.com"><ion-icon name="logo-facebook"></ion-icon></a></li>
                <li><a href="https://www.x.com"><ion-icon name="logo-twitter"></ion-icon></a></li>
                <li><a href="https://www.linkedin.com"><ion-icon name="logo-linkedin"></ion-icon></a></li>
                <li><a href="https://www.instagram.com"><ion-icon name="logo-instagram"></ion-icon></a></li>
            </ul>
            <ul className="menu">
                <li><a href="#">Home</a></li>
                <li><a href="#home-component-1">Swap</a></li>
                <li><a href="#introduction-card">Benefits</a></li>
                <li><a href="#earth-container">Achievements</a></li>
                <li><a href="#footer">Contact</a></li>
            </ul>
            <p>Copyright © 2024-2025 CompanyName®. All rights reserved.</p>
        </div>
    )
}

export default Footer;