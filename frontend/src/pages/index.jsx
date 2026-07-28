import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { loginDemo } from "@/config/redux/action/middleware/reducer/Authreducer";
import { loadDemoPosts } from "@/config/redux/action/middleware/reducer/Postreducer";
import styles from "@/styles/Home.module.css";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDemoLogin = () => {
    dispatch(loginDemo());
    dispatch(loadDemoPosts());
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Connect | Your Professional Network</title>
        <meta name="description" content="Join Connect to build your professional network, share your career journey, and discover opportunities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <UserLayout>
        <main className={styles.hero}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>
              Welcome to Your Professional Community
            </h1>
            <p className={styles.heroSubtitle}>
              Connect with colleagues, share your achievements, and discover new career opportunities. Your next chapter starts here.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/login" legacyBehavior>
                <a className={styles.heroButton}>Get Started</a>
              </Link>
              <button onClick={handleDemoLogin} className={styles.heroDemoButton}>
                ⚡ Try Demo
              </button>
            </div>
          </div>
          <div className={styles.heroRight}>
            <img 
              src="/images/Networking.gif" 
              alt="Professional Networking" 
              className={styles.heroImage}
            />
          </div>
        </main>
      </UserLayout>
    </>
  );
}

