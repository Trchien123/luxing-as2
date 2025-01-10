
import '../src/style/App.css';
import Home from './Home/Container-2';
import DbHome from './Dashboard/DbDashboard';
import DashTable from './Dashboard/DashTable';
import {
  Link,
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Dashboard from './Dashboard/dashboard';
import DashHistory from './Dashboard/DashHistory';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Dashboard' element={<Dashboard />}>
            <Route path="" element={<DbHome />} />
            <Route path="Table" element={<DashTable />} />
            <Route path="History" element={<DashHistory />} />
          </Route>

        </Routes>
      </Router>

    </div>

  );
}

export default App;
