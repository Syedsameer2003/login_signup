// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/SignupPage.css';

// function SignupPage() {
//   // State for each field
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [designation, setDesignation] = useState(''); // New state for designation

//   // Clear input fields on page load or refresh
//   useEffect(() => {
//     setName('');
//     setEmail('');
//     setPassword('');
//     setDesignation('');
//   }, []);

//   return (
//     <div className="signup-page">
//       <div className="signup-container">
//         <div className="left-side">
//           <div className="card">
//             <h2>Sign Up</h2>
//             {/* Name field */}
//             <input 
//               type="text" 
//               placeholder="Full Name" 
//               value={name}
//               onChange={(e) => setName(e.target.value)} 
//               className="input-field" 
//             />
//             {/* Email field */}
//             <input 
//               type="email" 
//               placeholder="Email" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)} 
//               className="input-field" 
//             />
//             {/* Password field */}
//             <input 
//               type="password" 
//               placeholder="Password" 
//               value={password}
//               onChange={(e) => setPassword(e.target.value)} 
//               className="input-field" 
//             />
//            {/* Designation dropdown */}
// <select
//   value={designation}
//   onChange={(e) => setDesignation(e.target.value)}
//   className="input-field"
// >
//   <option value="" disabled>
//     Select Your Role
//   </option>
//   <option value="Doctor">Doctor</option>
//   <option value="Receptionist">Receptionist</option>
//   <option value="Admin">Admin</option>
//   <option value="PA">PA</option>
//   <option value="Pharmacist">Pharmacist</option>
// </select>

//             <button>Sign Up</button>
//             <p className="switch-page">
//               Already have an account? <Link to="/login">Login</Link>
//             </p>
//           </div>
//         </div>
//         <div className="right-side">
//           <h2>Aiwane Tijarat O Sanat <br />Hospital</h2>
//           <img src="/images/logo.png" alt="Office Logo" className="office-logo" />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.css';

function SignupPage() {
  // State variables for input fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [error, setError] = useState('');

  // Clear input fields on page load or refresh
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setDesignation('');
    setError('');
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Basic validation
    if (!name || !email || !password || !designation) {
      setError('Please fill out all fields');
      return;
    }

    try {
      // Send data to backend
      const response = await axios.post('http://localhost:3000/api/auth/signup', {
        name,
        email,
        password,
        designation,
      });

      alert(response.data.message); // Show success message
      setName('');
      setEmail('');
      setPassword('');
      setDesignation('');
      setError('');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register user');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="left-side">
          <div className="card">
            <h2>Sign Up</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error */}
            
            {/* Name field */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />

            {/* Email field */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />

            {/* Password field */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />

            {/* Designation dropdown */}
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="input-field"
            >
              <option value="" disabled>
                Select Your Role
              </option>
              <option value="Doctor">Doctor</option>
              <option value="Receptionist">Receptionist</option>
              <option value="Admin">Admin</option>
              <option value="PA">PA</option>
              <option value="Pharmacist">Pharmacist</option>
            </select>

            {/* Submit button */}
            <button onClick={handleSubmit} className="submit-button">
              Sign Up
            </button>

            <p className="switch-page">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
        <div className="right-side">
          <h2>Aiwane Tijarat O Sanat <br /> Hospital</h2>
          <img src="/images/logo.png" alt="Office Logo" className="office-logo" />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
