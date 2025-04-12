"use client";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const starsRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Enter your credentials to continue"
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    createStars();
    checkExistingSession();
    setupKeyboardNavigation();
  }, []);

  function createStars() {
    if (!starsRef.current) return;
    const container = starsRef.current;
    container.innerHTML = "";
    const count = 150;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2;
      const delay = Math.random() * 3;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      container.appendChild(star);
    }
  }

  async function checkExistingSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem("pixelPlanetsUser", JSON.stringify(session.user));
        window.location.href = "/game";
      }
    } catch (error) {
      console.error("Session check failed:", error);
    }
  }

  function setupKeyboardNavigation() {
    function handleKeyPress(e) {
      if (e.key === "Enter") {
        signIn();
      }
    }
    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }

  function showStatus(message, type = null) {
    setStatusMessage(message);
  }

  async function signIn() {
    if (!email || !password) {
      showStatus("Please enter both email and password", "error");
      return;
    }
    showStatus("Logging in...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        showStatus(error.message, "error");
      } else {
        showStatus("Login successful, redirecting...", "success");
        localStorage.setItem("pixelPlanetsUser", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "/game";
        }, 1000);
      }
    } catch (err) {
      showStatus("Login failed: " + err.message, "error");
    }
  }

  async function signUp() {
    if (!email || !password) {
      showStatus("Please enter both email and password", "error");
      return;
    }
    if (password.length < 6) {
      showStatus("Password must be at least 6 characters", "error");
      return;
    }
    showStatus("Creating account...");

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showStatus(error.message, "error");
      } else {
        showStatus("Signup successful! Check your email to confirm.", "success");
      }
    } catch (err) {
      showStatus("Signup failed: " + err.message, "error");
    }
  }

  return (
    <>
      <header className="floating-header">
        <a href="/" className="logo">
          Welcome to Pixel Planets!
        </a>
      </header>

      <div ref={starsRef} className="stars" id="stars"></div>

      <div className="login-container">
        <div className="login-image">
          <img
            src="/TemplateData/planet.png"
            alt="Pixel Planet Animation"
            className="login-planet-animation"
          />
        </div>
        <div className="auth-form">
          <div className="input-field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email"
              autoComplete="email"
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
              autoComplete="current-password"
            />
          </div>

          <button onClick={signIn} className="auth-button primary-button">
            Login
          </button>
          <button onClick={signUp} className="auth-button secondary-button">
            Sign Up
          </button>

          <div id="status-message">{statusMessage}</div>
        </div>

        <div className="login-footer">
          <a href="/" className="back-link">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
}
