import { useState } from "react";
import { useRouter } from "next/router";
import { clientServer } from "@/config";
import styles from "./style.module.css";

export default function ResetPassword() {

  const router = useRouter();
  const { email } = router.query;

  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {

    if (!otp || !password || !confirmPassword) {
      return alert("All fields are required");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      setLoading(true);

      const response =
        await clientServer.post(
          "/api/users/reset-password",
          {
            email,
            otp,
            password
          }
        );

      alert(response.data.message);

      router.push("/login");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.title}>
          Reset Password
        </h1>

        <p className={styles.subtitle}>
          Enter OTP received on your email and
          create a new password.
        </p>

        <input
          className={styles.input}
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOTP(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          className={styles.primaryBtn}
          onClick={handleResetPassword}
        >
          {
            loading
              ? "Please wait..."
              : "Reset Password"
          }
        </button>

        <button
          className={styles.secondaryBtn}
          onClick={() =>
            router.push("/forgot-password")
          }
        >
          Go Back
        </button>

      </div>
    </div>
  );
}