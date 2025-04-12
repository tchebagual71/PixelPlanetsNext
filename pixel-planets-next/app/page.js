"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

export default function HomePage() {
  const starsRef = useRef(null);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    createStars();
    checkSession();
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

  async function checkSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const ctaButton = document.getElementById("cta-button");
        if (ctaButton) {
          ctaButton.textContent = "Continue Creating";
          // If you make /game a page.js in app/game, link to "/game"
          ctaButton.href = "/game";
        }
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  }

  return (
    <main>
      <div ref={starsRef} className="stars" id="stars"></div>
      <div className="hero">
        <div className="hero-content">

            <img
            // rotate slowly
              style={{ width: "100%", padding: "12px", boxShadow: "0 0 10px 5px #fff", margin: "20px" }}     
              src="/TemplateData/unipp.gif"
              alt="Pixel Planet Animation"
            />
      

          <h1 className="glow-text">Pixel Planets</h1>
          <p>
            Create, customize, and share your own procedurally generated pixel
            planets in this interactive web experience. Design unique worlds
            with different biomes, atmospheres, and features.
          </p>
          <p className="glow-text">
            This would not be possible without the great shaders provided by{" "}
            <a href="https://deep-fold.itch.io/pixel-planet-generator">
              @deep-fold.
            </a>
          </p>

          <div className="hero-buttons">
            <a href="/login" className="cta-button" id="cta-button">
              Start Creating
            </a>
            <a href="/about" className="cta-button secondary-button">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
