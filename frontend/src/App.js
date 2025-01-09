
import '../src/style/App.css';
import Menu from './Menu';

import Home from './Home/Container-2';
import Container1 from './Container-1';
import Sphere from './Sphere';
import {
  Link,
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Dashboard from './Dashboard/dashboard';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Dashboard' element={<Dashboard />} />
        </Routes>
      </Router>
      <Sphere />
    </div>
  );
}

export default App;
