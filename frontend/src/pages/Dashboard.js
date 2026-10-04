import React from 'react';
import CustomerDashboard from './CustomerDashboard';
import StaffDashboard from './StaffDashboard';
import AdminDashboard from './admin/AdminDashboard';

const Dashboard = ({ user }) => {
  // Route to appropriate dashboard based on user role
  if (!user) {
    return <CustomerDashboard user={user} />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'staff':
      return <StaffDashboard user={user} />;
    case 'customer':
    default:
      return <CustomerDashboard user={user} />;
  }
};

export default Dashboard;
