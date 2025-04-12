"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

export default function GamePage() {
  // References for star container
  const starsRef = useRef(null);

  // Create Supabase client with your public anon key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    createStars();
    loadUserInfo();
    setupLogoutButton();
    loadUnity();
  }, []);

  // ---- Star Background ----
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

  // ---- Load Logged-in User Info ----
  function loadUserInfo() {
    const userInfo = localStorage.getItem("pixelPlanetsUser");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const usernameElem = document.getElementById("username");
      if (usernameElem && user.email) {
        usernameElem.textContent = `Welcome, ${user.email.split("@")[0]}`;
      }
    }
  }

  // ---- Logout ----
  function setupLogoutButton() {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          // Supabase signOut
          await supabase.auth.signOut();
          // Clear localStorage if you prefer
          localStorage.removeItem("pixelPlanetsUser");
          // Redirect to homepage
          window.location.href = "/";
        } catch (error) {
          console.error("Logout failed:", error);
        }
      });
    }
  }

  // ---- Unity Loader ----
  function loadUnity() {
    // Dynamically load the Unity loader script from /public/Build
    const script = document.createElement("script");
    script.src = "/Build/PixelPlanetsWeb.loader.js";
    script.onload = () => {
      const canvas = document.getElementById("unity-canvas");
      // Use the globally injected createUnityInstance
      createUnityInstance(canvas, {
        dataUrl: "/Build/PixelPlanetsWeb.data",
        frameworkUrl: "/Build/PixelPlanetsWeb.framework.js",
        codeUrl: "/Build/PixelPlanetsWeb.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: "DefaultCompany",
        productName: "PixelPlanets",
        productVersion: "1.0",
        showBanner: (msg, type) => {
          console.log("[Unity Banner]", msg, type);
        },
      }).then((unityInstance) => {
        // Hook up the full-screen button
        const fullscreenButton = document.getElementById("unity-fullscreen-button");
        if (fullscreenButton) {
          fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
          };
        }
      });
    };
    document.body.appendChild(script);
  }

  return (
    <main>
      {/* The star container */}
      <div ref={starsRef} className="stars" />

      {/* Header with user info & logout */}
      <div id="game-header">
        <div id="user-info">
          <span id="username">Welcome, Planet Creator</span>
        </div>
        <div className="header-buttons">
          <button id="logout-btn" className="btn btn-primary">Logout</button>
          <button id="unity-fullscreen-button" className="btn btn-primary">Full Screen</button>
        </div>
      </div>

      {/* Unity container */}
      <div id="unity-container" className="unity-desktop">
        <canvas id="unity-canvas" width="960" height="600" tabIndex={-1}></canvas>
        <div id="unity-loading-bar">
          <div id="unity-logo"></div>
          <div id="unity-progress-bar-empty">
            <div id="unity-progress-bar-full"></div>
          </div>
        </div>
        <div id="unity-warning">
          If your browser does not support WebGL. 
          <a href="https://get.webgl.org/" title="WebGL official website">Find out how to get it.</a>
          <p>If the planet is blank, try clicking the dropdown menu underneath Planet Type and clicking around... *testing*</p>
        </div>
      </div>
    </main>
  );
}
