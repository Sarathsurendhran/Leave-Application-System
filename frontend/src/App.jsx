
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register'
import Login from './pages/login'
import Dashboard from './pages/Employe/Dashboard'
import ManagerHome from './pages/Manager/ManagerHome';
import PrivateRoute from './utils/PrivateRoute';
import ApplyLeaveModal from './pages/Employe/ApplyLeaveModal';
// import HistoryModal from './pages/Employe/HistoryModal';
import LeaveHistory from './pages/Employe/HistoryModal';
import ManagerLeaveHistory from './pages/Manager/LeaveHistory';
import EmployeeLeaveReport from './pages/Employe/EmployeeReport';
import ManagerLeaveReport from './pages/Manager/MangerReportPage';

const App = () => {
   
    return (
        <Router>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login/>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/> 
                <Route path="/applyleave" element={<PrivateRoute><ApplyLeaveModal/></PrivateRoute>}/> 
                <Route path="/managerhistoryleave" element={<PrivateRoute><ManagerLeaveHistory/></PrivateRoute>}/> 
                <Route path="/historyleave" element={<PrivateRoute><LeaveHistory/></PrivateRoute>}/> 
                <Route path="/empreport" element={<PrivateRoute><EmployeeLeaveReport/></PrivateRoute>}/> 
                <Route path="/manreport" element={<PrivateRoute><ManagerLeaveReport/></PrivateRoute>}/> 


                <Route path="/manager/home" element={<PrivateRoute><ManagerHome/></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;

