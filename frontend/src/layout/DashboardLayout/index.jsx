import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser , getAllUsers } from "@/config/redux/action/authAction";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";

export default function DashboardLayout({ children }) {
  const router = useRouter();
const dispatch = useDispatch();


const authState = useSelector((state) => state.auth);


useEffect(() => {
  if (typeof window === "undefined") return;


  dispatch(getAllPosts());
  dispatch(getAboutUser());
  dispatch(getAllUsers());
  



}, [dispatch]);

useEffect(() => {
  if (
    authState.message === "Please Login"
  ) {
    router.replace("/login");
  }
}, [authState.message, router]);


if (!authState.profileFetched) {
  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <h3>Loading dashboard...</h3>
    </div>
  );
}

const currentUserId = authState.profile?.userId?._id;
const currentUserBio = authState.profile?.bio?.toLowerCase() || "";

const relatedUsers = authState.all_users.filter((user) => {
  // स्वतःला exclude कर
  if (user._id === currentUserId) return false;

  // bio नसल्यास skip
  if (!user.bio) return false;

  const userBio = user.bio.toLowerCase();

  return (
    (currentUserBio.includes("mern") && userBio.includes("mern")) ||
    (currentUserBio.includes("react") && userBio.includes("react")) ||
    (currentUserBio.includes("node") && userBio.includes("node")) ||
    (currentUserBio.includes("mongodb") && userBio.includes("mongodb")) ||
    (currentUserBio.includes("java") && userBio.includes("java")) ||
    (currentUserBio.includes("python") && userBio.includes("python"))
  );
});

console.log("Current User Bio:", currentUserBio);
console.log("All Users:", authState.all_users);

console.log("FIRST USER", authState.all_users[0]);

  return (
    <div className={styles.container}>


      <div className={styles.homeContainer}>

      
        <div className={styles.homeContainer_leftBar}>
          <div>
            <div
              onClick={() => router.push("/dashboard")}
              className={styles.sideBarOption}
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>

              <p>Home</p>
            </div>

            <div
              onClick={() => router.push("/discover")}
              className={styles.sideBarOption}
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

              <p>Discover</p>
            </div>

            <div
              onClick={() => router.push("/my_connections")}
              className={styles.sideBarOption}
            ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>

              <p>My&nbsp;Connections</p>
            </div>
          </div>
        </div>

      
        <div className={styles.homeContainer_feedContainer}>
          {children}
        </div>

<div className={styles.homeContainer_extraContainer}>
  <div className={styles.topProfilesHeader}>
    <h3>Top Profiles</h3>
  </div>

 {relatedUsers?.slice(0, 5).map((user) => (
  <div
    key={user._id}
    className={styles.topProfileCard}
    onClick={() => router.push(`/profile/${user.username}`)}
  >
   <img style={{borderRadius:"50%", height:"70px"}}
  src={
    user.profilePicture
      ? `http://localhost:5000/uploads/${user.profilePicture}`
      : "/profile.png"
  }
  alt={user.name}
/>
   

    <div className={styles.topProfileInfo}>
      <h4>{user.name}</h4>
      <p>{user.bio || "Software Developer"}</p>
    </div>

  <button
  className={styles.profileButton}
  onClick={(e) => {
    e.stopPropagation();
    console.log("USERNAME:", user.username);
   router.push(`/view_profile/${user.username}`);
  }}
>
  View
</button>
    
  </div>

))}
</div>
</div>

      <div className={styles.mobileNavBar}>

          <div  onClick={() => router.push("/dashboard")} className={styles.singleNavItemHolder_mobileView}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>
          </div>

  <div  onClick={() => router.push("/discover")}  className={styles.singleNavItemHolder_mobileView}>
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
          </div>
<div  onClick={() => router.push("/my_connections")} className={styles.singleNavItemHolder_mobileView}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>
          </div>

      </div>
    </div>
  );
}

