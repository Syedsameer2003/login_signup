import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         {/* Default route to go to signup page */}
//         <Route path="*" element={<SignupPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// components/App.jsx

import Dashboard from './components/Dashboard.jsx';  // Your Dashboard component
import PrivateRoute from './components/ProtectedRoute.jsx';  // PrivateRoute component
import ForgotPassword from './components/ForgotPassword.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and Signup Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Route (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Optional: Default route to signup */}
        <Route path="*" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;

