import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";

import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import {
  getConnectionRequest,
  sendConnectionRequest,
  getMyConnectionsRequest
} from "@/config/redux/action/authAction";

import { getAllPosts } from "@/config/redux/action/postAction";




export default function ViewProfilePage({ userProfile }) {



const formatLastSeen = (date) => {

  const now = new Date();
  const lastSeen = new Date(date);

  const diff =
    Math.floor((now - lastSeen) / 1000);

  if (diff < 60)
    return `${diff} sec ago`;

  if (diff < 3600)
    return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hr ago`;

  return `${Math.floor(diff / 86400)} day ago`;
};
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [isMyProfile, setIsMyProfile] = useState(false);
  // 🚨 USER NOT FOUND SAFETY
  if (!userProfile) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>User not found</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }

  // fetch posts + connections
 const loadData = async () => {
  await dispatch(getAllPosts());
  await dispatch(getMyConnectionsRequest());
  await dispatch(getConnectionRequest());
};


useEffect(() => {
  loadData();
}, [dispatch]);

  // filter posts
  useEffect(() => {

    if (!postReducer?.posts || !router.query.username) return;

    const posts = postReducer.posts.filter(
      (post) => post?.userId?.username === router.query.username
    );

    setUserPosts(posts);

  }, [postReducer?.posts, router.query.username]);

  // connection status check
 useEffect(() => {

  const currentUserId =
    authState?.profile?.userId?._id;

  const connection =
    authState?.connectionRequest?.find((c) => {

      const senderId =
        c?.userId?._id || c?.userId;

      const receiverId =
        c?.connectionId?._id || c?.connectionId;

     return (
  (
    String(senderId) === String(currentUserId) &&
    String(receiverId) === String(userProfile?.userId?._id)
  ) ||
  (
    String(receiverId) === String(currentUserId) &&
    String(senderId) === String(userProfile?.userId?._id)
  )
) && c?.status_accepted === null;
    });

  const acceptedConnection =
  authState?.connections?.find((c) => {

    const senderId =
      c?.userId?._id || c?.userId;

    const receiverId =
      c?.connectionId?._id || c?.connectionId;

    return (
      (
        String(senderId) === String(currentUserId) &&
        String(receiverId) === String(userProfile?.userId?._id)
      ) ||
      (
        String(receiverId) === String(currentUserId) &&
        String(senderId) === String(userProfile?.userId?._id)
      )
    ) && c?.status_accepted === true;
  });


  if (acceptedConnection) {
    setConnectionStatus("connected");
  } else if (connection) {
    setConnectionStatus("pending");
  } else {
    setConnectionStatus("none");
  }

console.log("CONNECTIONS =", authState.connections);
console.log("REQUESTS =", authState.connectionRequest);
console.log("ACCEPTED =", acceptedConnection);
console.log("PENDING =", connection);

}, [
  authState.connections,
  authState.connectionRequest,
  authState.profile,
  userProfile?.userId?._id
]);
  useEffect(() => {
  if (
    authState?.profile?.userId?._id &&
    userProfile?.userId?._id
  ) {
    setIsMyProfile(
      authState.profile.userId._id === userProfile.userId._id
    );
  }
}, [authState?.profile, userProfile]);

  // connect button
const handleConnect = async () => {
  try {

    const result = await dispatch(
      sendConnectionRequest({
        connectionId: userProfile.userId._id
      })
    );

    if (
      result.type === "user/sendConnectionRequest/fulfilled"
    ) {
      setConnectionStatus("pending");
      return;
    }

  } catch (error) {
    console.log(error);
  }
};
  console.log("PROFILE", userProfile);
console.log("COVER", userProfile?.userId?.coverImage);
console.log(
  "ONLINE STATUS =",
  userProfile?.userId?.isOnline
);

console.log(
  "LAST SEEN =",
  userProfile?.userId?.lastSeen
);

  return (
<UserLayout>
<DashboardLayout>

<div className={styles.container}>

{/* Cover */}

  
<div className={styles.coverSection}>
<img
  src={userProfile?.userId?.coverImage || "/cover-placeholder.jpg"}
  alt="cover"
  style={{
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "12px",
  }}
/>
</div>
  

{/* Profile Header */}

<div className={styles.profileHeader}>

  <div className={styles.leftSection}>

 <img
  className={styles.profileImage}
src={
  userProfile?.userId?.profilePicture ||
  "/default.jpg"
}
  alt="profile"
/>
    <div className={styles.profileInfo}>
      <h1>{userProfile?.userId?.name}</h1>

      <p className={styles.username}>
        @{userProfile?.userId?.username}
      </p>

      <p>
  {!isMyProfile && (
    <p>
      {userProfile?.userId?.isOnline ? (
        <span
          style={{
            color: "green",
            fontWeight: "600"
          }}
        >
          🟢 Active
        </span>
      ) : (
        <span
          style={{
            color: "green"
          }}
        >
          {
            userProfile?.userId?.lastSeen
              ? formatLastSeen(
                  userProfile.userId.lastSeen
                )
              : "Offline"
          }
        </span>
      )}
    </p>
  )}

</p>

      <p className={styles.bio}>
        {userProfile?.bio}
      </p>
    </div>

  </div>

  <div className={styles.actionButtons}>
    {connectionStatus === "connected" && (
      <button className={styles.connectedButton}>
        Connected
      </button>
    )}

    {connectionStatus === "pending" && (
      <button className={styles.connectedButton}>
        Pending
      </button>
    )}

    {connectionStatus === "none" && !isMyProfile && (
      <button
        className={styles.connectBtn}
        onClick={handleConnect}
      >
        Connect
      </button>
    )}
  </div>

</div>

{/* About */}

  <div className={styles.sectionCard}>
    <h2>About</h2>
    <p>{userProfile?.bio}</p>
  </div>

{/* Recent Activity */}

<div className={styles.sectionCard}>
  <h2>Recent Posts</h2>
   {userPosts.length === 0 && (
    <p>No posts yet</p>
  )}

  {userPosts.map((post) => (
    <div
      key={post._id}
      className={styles.activityCard}
    >

      {post.media && (
        post.fileType?.startsWith("video") ? (
          <video
            controls
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          >
            <source
              src={post.media}
              type={post.fileType}
            />
          </video>
        ) : (
          <img
            src={post.media}
            alt="post"
            style={{
              width: "100%",
              borderRadius: "10px",
              marginBottom: "10px"
            }}
          />
        )
      )}

      <p>{post.body}</p>
      

    </div>
  ))}
</div>

{/* Work History */}

<div className={styles.sectionCard}>
  <h2>Work History</h2>

 {userProfile?.pastWork?.length > 0 ? (
  userProfile.pastWork.map((work, index) => (
    <div key={index} className={styles.workCard}>
      <h4>{work.company}</h4>
      <p>{work.position}</p>
      <p>{work.duration}</p>
    </div>
  ))
) : (
  <p>No work history added</p>
)}
</div>

{/* Education */}

 <div className={styles.sectionCard}>
  <h2>Education</h2>

 {userProfile?.education?.length > 0 ? (
  userProfile.education.map((edu, index) => (
    <div key={index} className={styles.workCard}>
      <h4>{edu.school}</h4>
      <p>{edu.degree}</p>
      <p>{edu.fieldOfStudy}</p>
    </div>
  ))
) : (
  <p>No education added</p>
)}
</div>

</div>


</DashboardLayout>
</UserLayout>
  );
}

export async function getServerSideProps(context) {

  try {

    const request = await clientServer.get(
      "http://localhost:5000/api/users/get_User_Profile_And_User_Based_On_Username",
      {
        params:{
          username: context.query.username
        }
      }
    );

    return {
      props:{
        userProfile: request?.data?.profile || null
      }
    };

  } catch(error) {

    return {
      props:{
        userProfile:null
      }
    };

  }

}