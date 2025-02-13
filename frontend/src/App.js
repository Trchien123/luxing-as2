
import '../src/style/App.css';
import Home from './Home/Home';
import DbHome from './Dashboard/DbDashboard';
import DashTable from './Dashboard/DashTable';
import {

  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import Dashboard from './Dashboard/Db';

import DashNews from './Dashboard/DbNews';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Dashboard' element={<Dashboard />}>
            <Route path="" element={<DbHome />} />
            <Route path="Table" element={<DashTable />} />
            <Route path="News" element={<DashNews />} />
          </Route>

        </Routes>
      </Router>

    </div>

  );
}

export default App;
