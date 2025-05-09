import React from "react";
import { Outlet } from "react-router-dom";
import SideTab from "./SideBar";
import "./index.css";
import css from "./DefaultLayout.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ProfilePage from "../pages/ProfilePage"; // 경로는 실제 위치에 맞게 수정

export const DefaultLayout = () => {
  return (
    <div className={css.defaultLayout}>
      <SideTab />
      <ProfilePage />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
