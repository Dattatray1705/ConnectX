import { useState } from "react";
import { useRouter } from "next/router";
import { clientServer } from "@/config";
import styles from "./style.module.css";

export default function ForgotPassword() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {

    try {

      setLoading(true);

      const response =
        await clientServer.post(
          "/api/users/send-otp",
          { email }
        );

      alert(response.data.message);

      router.push(
        `/reset-password?email=${email}`
      );

    } catch (error) {

      alert(
        error.response?.data?.message
      );

    } finally {

      setLoading(false);

    }
  };

  return (
  <div className={styles.page}>
    <div className={styles.card}>

      <img
        src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png"
        alt="forgot password"
        className={styles.icon}
      />

      <h1 className={styles.title}>
        Forgot Password
      </h1>

      <p className={styles.subtitle}>
        Enter your registered email address.
        We will send you an OTP to reset your password.
      </p>

      <input
        className={styles.input}
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <button
        className={styles.primaryBtn}
        onClick={sendOTP}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <button
        className={styles.secondaryBtn}
        onClick={() => router.push("/login")}
      >
        Back To Login
      </button>

    </div>
  </div>
);
}