import "./Menu.css";

function Menu() {
  return (
    <nav>
      <input type="checkbox" id="check" />
      <div class="logo">Lu Xing</div>
      <div class="menus">
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#home-component-1">Swap</a>
          </li>
          <li>
            <a href="#introduction-card">Benefits</a>
          </li>
          <li>
            <a href="#earth-container">Achievements</a>
          </li>
          <li>
            <a href="#footer">Contact</a>
          </li>
        </ul>
      </div>
      <label for="check" class="open-menu">
        <i class="fas fa-bars"></i>
      </label>
      <label for="check" class="close-menu">
        <i class="fas fa-times"></i>
      </label>
    </nav>
  );
}

export default Menu;
