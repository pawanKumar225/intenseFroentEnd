// // src/utils/auth.js
// export const getLoggedInUser = () => {
//   try {
//     const adminData = localStorage.getItem('adminData');
//     if (!adminData) return null;
//     const user = JSON.parse(adminData);
//     return user?.name || null;
//   } catch (error) {
//     console.error('Error getting logged in user:', error);
//     return null;
//   }
// };

// export const getLoggedInUserFullData = () => {
//   try {
//     const adminData = localStorage.getItem('adminData');
//     if (!adminData) return null;
//     return JSON.parse(adminData);
//   } catch (error) {
//     console.error('Error getting user data:', error);
//     return null;
//   }
// };

// export const getLoggedInUserRole = () => {
//   try {
//     const adminData = localStorage.getItem('adminData');
//     if (!adminData) return null;
//     const user = JSON.parse(adminData);
//     return user?.role || null;
//   } catch (error) {
//     console.error('Error getting user role:', error);
//     return null;
//   }
// };


// src/utils/auth.js
export const getLoggedInUser = () => {
  try {
    const userData = localStorage.getItem('adminData');
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || user.email?.split('@')[0] || 'Admin';
    }
    const email = localStorage.getItem('adminEmail');
    return email ? email.split('@')[0] : 'Admin';
  } catch (error) {
    return 'Admin';
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminEmail');
  localStorage.removeItem('adminData');
};