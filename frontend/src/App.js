
import '../src/style/App.css';
import Menu from './Menu';
import Home from './Home/Container-2';
import Container1 from './Container-1';
import Sphere from './Sphere';
  
function App() {
  return (
    <div className="App">
      <Menu />
      <Container1 />
      <Home />
      <Sphere />
    </div>
  );
}

export default App;
