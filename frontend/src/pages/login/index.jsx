import UserLayout from "@/layout/UserLayout";
import { useEffect, useState, useRef } from "react";
import styles from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { loginUser, registerUser , getAboutUser,} from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function Login() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const redirected = useRef(false); // ✅ IMPORTANT

  const [isLoginMethod, setIsLoginMethod] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
  if (
    (authState.loggedIn || authState.profile) &&
    !redirected.current
  ) {
    redirected.current = true;
    router.replace("/dashboard");
  }
}, [authState.loggedIn, authState.profile, router]);

  /* ✅ Clear message on switch */
  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoginMethod]);

const handleLogin = async () => {
  if (!email || !password) {
    alert("Email and Password required");
    return;
  }

  const result = await dispatch(
    loginUser({
      email,
      password,
    })
  );

  if (loginUser.fulfilled.match(result)) {
    await dispatch(getAboutUser());
  }
};




  const handleRegister = () => {
    if (!username || !name || !email || !password) {
      alert("All fields are required");
      return;
    }
    dispatch(registerUser({ username, name, email, password }));
  };

  return (
   <UserLayout>
  <div className={styles.loginPage}>

    

    <div className={styles.cardContainer}>
    

      {/* LEFT SIDE */}
      <div className={styles.cardContainer_left}>

        <div>
          <h1 className={styles.heading}>
            {isLoginMethod
              ? "Welcome Back 👋"
              : "Create Account 🚀"}
          </h1>

          <p className={styles.subHeading}>
            {isLoginMethod
              ? "Login and continue building your professional network."
              : "Join ConnectX and start connecting with professionals."}
          </p>
        </div>

        {authState.message && (
          <div
            className={
              authState.isError
                ? styles.errorMessage
                : styles.successMessage
            }
          >
            {authState.message}
          </div>
        )}

        <div className={styles.inputContainer}>

          {!isLoginMethod && (
            <div className={styles.inputRow}>
              <input
                className={styles.inputField}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                className={styles.inputField}
                placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <input
            className={styles.inputField}
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

  

{isLoginMethod && (
  <div
    style={{
      textAlign: "right",
      marginTop: "10px",
      marginBottom: "15px",
    }}
  >
    <span
      style={{
        cursor: "pointer",
        color: "#3366ff",
        fontSize: "14px",
      }}
      onClick={() =>
        router.push("/forgot-password")
      }
    >
      Forgot Password?
    </span>
  </div>
)}











          <button
            disabled={authState.isLoading}
            onClick={
              isLoginMethod
                ? handleLogin
                : handleRegister
            }
            className={styles.submitBtn}
          >
            {authState.isLoading
              ? "Please wait..."
              : isLoginMethod
              ? "Sign In"
              : "Create Account"}
          </button>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.cardContainer_right}>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="network"
          className={styles.illustration}
        />

        <h2>
          {isLoginMethod
            ? "New Here?"
            : "Already Registered?"}
        </h2>

        <p>
          Connect with developers,
          students and professionals.
        </p>

        <button
          className={styles.switchBtn}
          onClick={() =>
            setIsLoginMethod(!isLoginMethod)
          }
        >
          {isLoginMethod
            ? "Create Account"
            : "Sign In"}
        </button>

      </div>

    </div>
  </div>
</UserLayout>
  );
}
