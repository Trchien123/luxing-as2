
import '../src/style/App.css';
import Home from './Home/Container-2';
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
          <Route exact path='/' element={<Home />} > </Route>
          <Route exact path="/Dashboard" element={<Dashboard />}></Route>
        </Routes>
      </Router>




    </div>
  );
}

export default App;
