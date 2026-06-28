import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/config/redux/reducer/authReducer";
import { getAboutUser } from "@/config/redux/action/authAction";
import { clientServer } from "@/config";
import { getNotifications }from "@/config/redux/action/notificationAction";
export default function NavBarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const { notifications } = useSelector(
    (state) => state.notification
  );

  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] =
    useState(false);

  const unreadCount =
    notifications?.filter(
      (item) => !item.isRead
    ).length || 0;

  const isAuthPage =
    router.pathname === "/" ||
    router.pathname === "/login";

useEffect(() => {
  dispatch(getAboutUser());
  dispatch(getNotifications());
}, [dispatch]);


const removeNotification = async (
  notificationId
) => {

  console.log(
    "DELETE REQUEST =",
    notificationId
  );

  try {

    const response =
      await clientServer.post(
        "/api/users/notifications/delete",
        {
          notificationId
        }
      );

    console.log(
      "DELETE RESPONSE =",
      response.data
    );

    await dispatch(
      getNotifications()
    );

  } catch (error) {

    console.log(error);

  }

};

  return (
    <div className={styles.container}>
      {/* Drawer */}

      {showMenu && (
        <div className={styles.drawer}>
          <div
            className={styles.closeBtn}
            onClick={() => setShowMenu(false)}
          >
            ✕
          </div>

          <div
            className={styles.drawerItem}
            onClick={() => {
              router.push("/dashboard");
              setShowMenu(false);
            }}
          >
            🏠 Home
          </div>

          <div
            className={styles.drawerItem}
            onClick={() => {
              router.push("/discover");
              setShowMenu(false);
            }}
          >
            🔍 Discover
          </div>

          <div
            className={styles.drawerItem}
            onClick={() => {
              router.push("/my_connections");
              setShowMenu(false);
            }}
          >
            👥 Connections
          </div>

          <div
            className={styles.drawerItem}
            onClick={() => {
              router.push("/profile");
              setShowMenu(false);
            }}
          >
            👤 Profile
          </div>

          <div
            className={styles.drawerItem}
            onClick={async () => {
              await clientServer.post(
                "/api/users/logout"
              );

              dispatch(logout());

              router.replace("/login");
            }}
          >
            🚪 Logout
          </div>
        </div>
      )}

      {/* Navbar */}

      <div className={styles.navBar}>
        {/* Mobile Hamburger */}

        {!showMenu && (
          <div
            className={styles.hamburger}
            onClick={() => setShowMenu(true)}
          >
            ☰
          </div>
        )}

        {/* Logo */}

        <div
          className={styles.logo}
          onClick={() => router.push("/dashboard")}
        >
          ConnectX
        </div>

        {/* User Section */}

        {!isAuthPage &&
          authState.profile && (
            <div
              className={
                styles.profileSection
              }
            >
              {/* Notification */}

              <div
                className={
                  styles.notificationIcon
                }
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
              >
                🔔

                {unreadCount > 0 && (
                  <span
                    className={
                      styles.badge
                    }
                  >
                    {unreadCount}
                  </span>
                )}

                {showNotifications && (
                  <div
                    className={
                      styles.notificationDropdown
                    }
                  >
                    <h3>
                      Notifications
                    </h3>

                    {notifications.length ===
                    0 ? (
                      <p>
                        No
                        Notifications
                      </p>
                    ) : (
                      notifications.map(
                        (
                          item
                        ) => (
                          <div
                            key={
                              item._id
                            }
                            className={
                              styles.notificationItem
                            }
                            onClick={(e) => {
                            e.stopPropagation();
                            console.log("CLICKED =",item._id );

  removeNotification(item._id);
}}
                          >
                            <img
                              src={
                                item
                                  .sender
                                  ?.profilePicture ||
                                "/default.jpg"
                              }
                              alt=""
                              width="40"
                              height="40"
                            />
                            

                            <p>
                              {
                                item.message
                              }
                            </p>
                             <small>{item._id}</small>
                            <hr />
                          </div>
                        )
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Desktop Only */}

              <img
                onClick={() =>
                  router.push(
                    "/profile"
                  )
                }
                src={
                  authState
                    ?.profile
                    ?.userId
                    ?.profilePicture ||
                  "/default.jpg"
                }
                alt="profile"
                className={
                  styles.profileImage
                }
              />

              <p
                className={
                  styles.profileBtn
                }
                onClick={() =>
                  router.push(
                    "/profile"
                  )
                }
              >
                Profile
              </p>

              <p
                className={
                  styles.logoutBtn
                }
                onClick={async () => {
                  await clientServer.post(
                    "/api/users/logout"
                  );

                  dispatch(
                    logout()
                  );

                  router.replace(
                    "/login"
                  );
                }}
              >
                Logout
              </p>
            </div>
          )}
      </div>
    </div>
  );
}