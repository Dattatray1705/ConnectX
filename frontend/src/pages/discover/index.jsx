import React, { useEffect ,useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import styles from "./style.module.css";
import { useRouter } from "next/router";

export default function Discoverpage() {

const formatLastSeen = (date) => {

  if (!date) return "Offline";

  const now = new Date();
  const lastSeen = new Date(date);

  const diff = Math.floor(
    (now - lastSeen) / 1000
  );

  if (diff < 60) {
    return `${diff} sec ago`;
  }

  if (diff < 3600) {
    return `${Math.floor(diff / 60)} min ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)} hr ago`;
  }

  return `${Math.floor(diff / 86400)} day ago`;
};




const [search, setSearch] = useState("");
  const authState = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  console.log(authState);          // 👈 इथे
  console.log(authState.allUsers); 
  useEffect(()=>{
    if(!authState.All_profiles_fetched){
      dispatch(getAllUsers());
    }
  },[dispatch, authState.All_profiles_fetched]);

  
  const currentUserId = authState?.profile?.userId?._id;
const filteredUsers = authState?.all_users?.filter((user) => {
  const searchText = search.trim().toLowerCase();

  return (
    user?._id !== currentUserId &&
    (
      user?.name?.toLowerCase().includes(searchText) ||
      user?.username?.toLowerCase().includes(searchText)
    )
  );
});
console.log(
  "FILTERED USERS =",
  filteredUsers
);

console.log("ALL USERS =", authState.all_users);
  return (
    <UserLayout>
      <DashboardLayout>

        <div>
          <h1 className={styles.Discover}>Discover</h1>
          <div className={styles.searchContainer}>
  <input
    type="text"
    placeholder="🔍 Search users by name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)} //    Current text inside input box

    className={styles.searchInput}
  />
</div>


          <div className={styles.allUserProfile}>
              
            {filteredUsers?.map((user)=>(
        

              <div 
               onClick={() => router.push(`/view_profile/${user.username}`)}
               key={user._id} className={styles.userCard}>
  <img
                  className={styles.userCard_img}
                  src={user?.profilePicture || "/default.jpg"}
                  alt="profile"
                />
                <div className={styles.userInfo}>

                  <p className={styles.status}>
  {user?.isOnline ? (
    <span style={{ color: "green" }}>
      🟢 Active
    </span>
  ) : (
    <span style={{ color: "red" }}>
      {
        user?.lastSeen
          ? formatLastSeen(user.lastSeen)
          : "Offline"
      }
    </span>
  )}
</p>
                <h2>{user?.name}</h2>
                <p>{user?.username}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </DashboardLayout>
      
    </UserLayout>
  );
}