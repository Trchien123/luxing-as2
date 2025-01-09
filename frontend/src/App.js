
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
          <Route path='/' element={<Home/>}></Route>
          <Route path='/Dashboard' element={<Dashboard/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
