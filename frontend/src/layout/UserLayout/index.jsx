import React, { useEffect } from "react";
import Navbar from "@/Components/Navbar";
import { useDispatch } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";

export default function UserLayout({ children }) {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAboutUser());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}