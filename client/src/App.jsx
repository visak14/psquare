import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard";
import { Register } from "./pages/Register";
import Login from "./pages/Login";
import { Employee } from './pages/Employee';
import {  Attendence } from './pages/Attendance';
import { Candidates } from './pages/Candidates';
import { Leave } from './pages/Leaves';


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          
        
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="employees" element={<Employee />} />
            <Route path="attendance" element={<Attendence />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="leave" element={<Leave />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
