import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import LoginPage from './components/LoginPage.jsx';
import Register from './components/Register.jsx';
import AcademicRegistrarDashboard from './components/AcademicRegistrarDashboard.jsx';
const root=ReactDOM.createRoot(document.getElementById('root'));root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route index element ={<Home/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/app" element={<App />} />
        <Route path = "/AcademicRegistrarDashboard" element={<AcademicRegistrarDashboard/>}/>
      </Routes>
    </Router>
  </React.StrictMode>,
);
