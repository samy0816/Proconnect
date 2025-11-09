import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./styles.module.css";
import { login, registerUser } from "@/config/redux/action/authAction";
import { reset as resetAuth } from "@/config/redux/action/middleware/reducer/Authreducer";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoginMethod, setIsLoginMethod] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (authState.loggedin) {
      router.push("/dashboard");
    }
  }, [authState.loggedin, router]);

  useEffect(() => {
    // Clear errors when toggling forms or when auth state changes
    setLocalError("");
    if(authState.iserror || authState.issuccess) {
      dispatch(resetAuth());
    }
  }, [isLoginMethod, dispatch]);

  const handleRegister = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password || !name || !username) {
      setLocalError("All fields are required for signup.");
      return;
    }
    dispatch(registerUser({ email, password, name, username }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLocalError("");
    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    dispatch(login({ email, password }));
  };

  const toggleForm = () => {
    setIsLoginMethod(!isLoginMethod);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <div className={styles.leftCardContainer}>
          <h1 className={styles.cardLeftHeading}>
            {isLoginMethod ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className={styles.cardLeftSubheading}>
            Stay connected and build your professional network.
          </p>

          {localError && <p className={styles.errorText}>{localError}</p>}
          {authState.iserror && authState.message && (
            <p className={styles.errorText}>{authState.message}</p>
          )}
          
          <form onSubmit={isLoginMethod ? handleLogin : handleRegister}>
            <div className={styles.cardLeftInputContainer}>
              {!isLoginMethod && (
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              )}
              {!isLoginMethod && (
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  type="text"
                  placeholder="Username"
                  required
                />
              )}
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="Email"
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className={styles.cardLeftButtonContainer}>
              <button type="submit">
                {isLoginMethod ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>

          <p className={styles.toggleText} onClick={toggleForm}>
            {isLoginMethod
              ? "Don't have an account? "
              : "Already have an account? "}
            <span>{isLoginMethod ? "Sign Up" : "Sign In"}</span>
          </p>
        </div>
        <div className={styles.rightCardContainer} />
      </div>
    </div>
  );
}

export default LoginComponent;