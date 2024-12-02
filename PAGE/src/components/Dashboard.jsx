import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || {}; // Parse user info

  return (
    <div>
      <h1>Welcome, {user.name || 'User'}!</h1> {/* Show user name */}
    </div>
  );
}

export default Dashboard;
