export const getLoggedInUser = () => {
  try {
    const userData = localStorage.getItem("AdminName");
    // const userData = localStorage.getItem("AdminName");
    // const userData = localStorage.getItem("AdminName");
console.log("..................",userData)
    if (!userData) return null;

    return userData;
  } catch (error) {
    console.error("Error fetching user from localStorage:", error);
    return null;
  }
};