import React from "react";
import SideTab from "../common/SideBar";
import ProfilePage from "../pages/ProfilePage";

const getUserFromJwt = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const OrganizationPage = () => {
  const user = getUserFromJwt();
  return (
    <div>
      <SideTab />
      <ProfilePage user={user} />
    </div>
  );
};

export default OrganizationPage;
