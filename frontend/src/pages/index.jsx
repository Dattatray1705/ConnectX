import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import UserLayout from "../layout/UserLayout";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>ConnectX - Professional Network</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.mainContainer}>

          {/* LEFT SECTION */}
          <div className={styles.mainContainer_left}>

            <div className={styles.heroBadge}>
              🚀 Professional Career Network
            </div>

            <h1 className={styles.heroTitle}>
              Connect, Grow & Build Your Professional Identity
            </h1>

            <p className={styles.heroDesc}>
              ConnectX helps students, developers and professionals
              build meaningful connections, showcase achievements,
              discover opportunities and grow their careers.
            </p>

            <div className={styles.heroButtons}>

              <button
                onClick={() => router.push("/login")}
                className={styles.primaryBtn}
              >
                Get Started
              </button>

              <button
                onClick={() => router.push("/discover")}
                className={styles.secondaryBtn}
              >
                Explore Network
              </button>

            </div>

            <div className={styles.stats}>

              <div>
                <h2>100+</h2>
                <p>Users</p>
              </div>

              <div>
                <h2>50+</h2>
                <p>Connections</p>
              </div>

              <div>
                <h2>500+</h2>
                <p>Posts Shared</p>
              </div>

            </div>

          </div>

          {/* RIGHT SECTION */}
          <div className={styles.mainContainer_right}>

            <img
              src="https://media.licdn.com/dms/image/sync/v2/D4D27AQHP85FZVvAf5g/articleshare-shrink_800/B4DZju0YQEGkAI-/0/1756353365823?e=2147483647&v=beta&t=A2OsAFQ_-3nYQZAm6NfALYDIKvG9-VV3SK6w1yJISoA"
              alt="ConnectX"
              className={styles.heroImage}
            />

          </div>

        </div>
      </div>
    </UserLayout>
  );
}