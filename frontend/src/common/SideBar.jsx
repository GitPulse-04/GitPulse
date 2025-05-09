import React, { useEffect, useState } from "react";
import css from "./SideBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { throttle } from "../utils/feature";

const SideBar = () => {
  const [isOn, setIsOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("jwt"));
  }, []);

  const handleResize = throttle(() => {
    if (window.innerWidth > 1100) {
      setIsOn(false);
    }
  }, 1000);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  return (
    <div className={isOn ? `${css.sideBarCon} ${css.on}` : css.sideBarCon}>
      <a href="/mygit">
        <div className={css.icon}>
          <img src="./img/icon_mini.png" />
        </div>
      </a>
      <div className={css.sideBarList}>
        <CustomNavLink to={"/mygit"} label={"My Git"} icon={"bi-person-fill"} />
        <CustomNavLink
          to={"/organizaiton"}
          label={"Organization_1"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton2"}
          label={"Organization_2"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton3"}
          label={"Organization_3"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton4"}
          label={"Organization_4"}
          icon={"bi-people-fill"}
        />
        <CustomNavLink
          to={"/organizaiton5"}
          label={"Organization_5"}
          icon={"bi-people-fill"}
        />
      </div>
      {isLoggedIn && (
        <button
          className={css.logoutButton}
          onClick={handleLogout}
          aria-label="로그아웃"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleLogout();
          }}
        >
          로그아웃
        </button>
      )}
    </div>
  );
};

const CustomNavLink = ({ to, label, icon }) => (
  <NavLink
    className={({ isActive }) => (isActive ? `${css.active}` : "")}
    to={to}
  >
    <i className={`bi ${icon}`}></i>
    <p> {label}</p>
  </NavLink>
);

export default SideBar;
