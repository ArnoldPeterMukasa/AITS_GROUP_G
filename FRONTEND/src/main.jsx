import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import LoginPage from './components/LoginPage.jsx';
import Register from './components/Register.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';
import AcademicRegistrarDashboard from './components/AcademicRegistrarDashboard.jsx';
import ManageUsersPage from './components/ManageUsersPage.jsx';
import Settings from './components/Settings.jsx';
import Notifications from './components/Notifications.jsx';
import ForgotPasswordPage from './components/ForgotPasswordPage.jsx';
import VerificationCodePage from './components/VerificationCodePage.jsx';
import ResetPasswordPage from './components/ResetPasswordPage.jsx';

import LecturerDashboard from './components/LecturerDashboard.jsx';

import Inbox from './components/Inbox.jsx'; 

import ManageIssues from './components/ManageIssues.jsx';
import Assignments from './Assignments.jsx';
import CourseContent from './CourseContent.jsx'
import CreateIssueForm from './components/CreateIssueForm.jsx';
import 'animate.css';


const root=ReactDOM.createRoot(document.getElementById('root'));root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element ={<Home/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerificationCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/app" element={<App/>} />
        <Route path="/StudentDashboard" element={<StudentDashboard/>}/>
        <Route path = "/AcademicRegistrarDashboard/*" element={<AcademicRegistrarDashboard/>}/>
        <Route path="/ManageUsersPage" element={<ManageUsersPage />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Notifications" element={<Notifications />} />

        
        
        <Route path="/inbox" element={<Inbox />} /> 

        <Route path="/LecturerDashboard" element={<LecturerDashboard />} />
        <Route path="/ManageIssues" element={<ManageIssues/>}/>
        <Route path="/Assignments" element={<Assignments/>}/>
        <Route path="/CourseContent" element={<CourseContent/>}/>
        <Route path="/CreateIssueForm" element={<CreateIssueForm/>}/>
   
        
        

      </Routes>
    </Router>
  </React.StrictMode>,
);
