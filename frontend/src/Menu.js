import './Menu.css';

function Menu() {
    return (
        <nav>
            <input type="checkbox" id="check" />
            <div class="logo">Company Name</div>
            <div class="menus">
                <ul>
                <li><a href="">Home</a></li>
                <li><a href="">About</a></li>
                <li><a href="">Services</a></li>
                <li><a href="">Team</a></li>
                <li><a href="">Contact</a></li>
                </ul>
            </div>
            <label for="check" class="open-menu"><i class="fas fa-bars"></i></label>
            <label for="check" class="close-menu"><i class="fas fa-times"></i></label>
        </nav>
    )
}

export default Menu;