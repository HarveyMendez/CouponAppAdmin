import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';

const App = () => {
  return (
      <Router basename="/couponApp">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<HomePage/>} />
        </Routes>
      </Router>
  );
};

export default App;
