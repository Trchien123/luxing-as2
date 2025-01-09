
import '../src/style/App.css';
import Menu from './Menu';
import Home from './Home/Container-2';
import Container1 from './Container-1';
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
      <Home />
    </div>
  );
}

export default App;
