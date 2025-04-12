"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AboutPage() {
  // Refs for DOM elements
  const starsRef = useRef(null);
  const navRef = useRef(null);

  // Create a Supabase client for feedback form & session checks
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    createStars();
    setupMobileMenu();
    createPlanetExamples();
    checkSession();
    setupFeedbackForm();
  }, []);

  // ---------------------------
  // STAR BACKGROUND
  // ---------------------------
  function createStars() {
    if (!starsRef.current) return;
    const starsContainer = starsRef.current;
    starsContainer.innerHTML = ""; // clear old stars on re-render
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

      starsContainer.appendChild(star);
    }
  }

  // ---------------------------
  // MOBILE MENU TOGGLE
  // ---------------------------
  function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const mainNav = document.getElementById("main-nav");
    if (!mobileMenuToggle || !mainNav) return;

    mobileMenuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  // ---------------------------
  // PLANET EXAMPLES
  // ---------------------------
  function createPlanetExamples() {
    const planetsContainer = document.getElementById("planet-examples");
    if (!planetsContainer) return;

    planetsContainer.innerHTML = "";
    const planetTypes = [
      { type: "desert", name: "Desert Planet" },
      { type: "ocean", name: "Ocean World" },
      { type: "forest", name: "Forest Planet" },
      { type: "ice", name: "Ice World" },
      { type: "volcanic", name: "Volcanic Planet" },
      { type: "gas", name: "Gas Giant" },
    ];

    planetTypes.forEach((planet) => {
      const planetDiv = document.createElement("div");
      planetDiv.className = "planet-example";
      planetDiv.setAttribute("aria-label", planet.name);

      // image-like background
      const planetImg = document.createElement("div");
      planetImg.style.width = "100%";
      planetImg.style.height = "100%";
      planetImg.title = planet.name;

      // Choose which image to show
      switch (planet.type) {
        case "desert":
          planetImg.style.background = 'url("/TemplateData/8.png") no-repeat center center / cover';
          break;
        case "ocean":
          planetImg.style.background = 'url("/TemplateData/2.png") no-repeat center center / cover';
          break;
        case "forest":
          planetImg.style.background = 'url("/TemplateData/9.png") no-repeat center center / cover';
          break;
        case "ice":
          planetImg.style.background = 'url("/TemplateData/4.png") no-repeat center center / cover';
          break;
        case "volcanic":
          planetImg.style.background = 'url("/TemplateData/5.png") no-repeat center center / cover';
          break;
        case "gas":
          planetImg.style.background = 'url("/TemplateData/6.png") no-repeat center center / cover';
          break;
      }

      planetDiv.appendChild(planetImg);
      planetsContainer.appendChild(planetDiv);
    });
  }

  // ---------------------------
  // SESSION CHECK
  // ---------------------------
  async function checkSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // user is logged in, update "Start Creating" button
        const loginBtn = document.getElementById("login-btn");
        if (loginBtn) {
          loginBtn.textContent = "Continue Creating";
          loginBtn.href = "/game"; // or "/login" if you prefer
        }
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  }

  // ---------------------------
  // FEEDBACK FORM
  // ---------------------------
  function setupFeedbackForm() {
    const feedbackForm = document.getElementById("feedback-form");
    if (!feedbackForm) return;

    feedbackForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const feedbackMessage = document.getElementById("feedbackMessage");
      if (!feedbackMessage) return;

      try {
        const feedback = feedbackMessage.value;
        // Insert feedback into 'feedback' table
        await supabase.from("feedback").insert([{ message: feedback }]);
        alert("Feedback submitted!");
        feedbackForm.reset();
      } catch (error) {
        console.error("Error:", error);
        alert("Submission failed.");
      }
    });
  }

  return (
    <html lang="en">
      <head>
        <title>About Pixel Planets - Our Story</title>
        <meta
          name="description"
          content="Learn about Pixel Planets - a web-based interactive experience for creating procedurally generated pixel art planets."
        />
      </head>
      <body>
        <div ref={starsRef} className="stars" id="stars"></div>

        <header className="page-header">
          {/* Link to / instead of index.html */}
          <a href="/" className="logo">
            <div className="logo-icon"></div>
            Pixel Planets
          </a>

          <button
            className="mobile-menu-toggle"
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav id="main-nav">
            <ul>
              <li>
                <a href="/" className="cta-button">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="cta-button active">
                  About
                </a>
              </li>
              <li>
                <a href="/login" className="cta-button" id="login-btn">
                  Start Creating
                </a>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <section className="about-section">
            <h2>For the Creators and Artist</h2>
            <p>
              Pixel Planets is a web-based interactive experience that lets you
              create and customize your own pixel art planets. Our procedural
              generation system ensures that each planet is unique, giving you
              endless possibilities to explore and create.
            </p>
            <p>
              Utilizing the incredible shaders provided by{" "}
              <a href="https://deep-fold.itch.io/pixel-planet-generator">
                deep-fold
              </a>{" "}
              in Godot for allowing this web app to be possible
            </p>
            <p>
              The project began as an exploration of procedural generation
              techniques applied to pixel art. We wanted to create a tool that
              would be both accessible to beginners and deep enough for
              experienced artists to enjoy. The result is a platform where users
              can easily generate beautiful pixel planets with just a few
              clicks, while still having fine control over the details.
            </p>

            <div className="gif-container">
              <img
                src="/TemplateData/unipp.gif"
                alt="Pixel Planets Demo"
                loading="lazy"
              />
            </div>
          </section>

          <section className="about-section">
            <h2>Planet Examples</h2>
            <p>Here are some examples of what you can create with Pixel Planets:</p>

            <div className="planet-examples" id="planet-examples"></div>

            <p>
              These are just a few examples of what's possible. With Pixel
              Planets, you can create an infinite variety of worlds, each with
              its own unique characteristics and visual style.
            </p>
          </section>

          <section className="about-section">
            <h2>Key Features</h2>
            <p>
              Pixel Planets offers a range of features designed to make planet
              creation both fun and powerful:
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Procedural Generation</h3>
                <p>
                  Each planet is algorithmically generated, ensuring that no two
                  planets are exactly alike. Our system creates natural-looking
                  terrains, atmospheres, and features.
                </p>
              </div>
              <div className="feature-card">
                <h3>Customizable Parameters</h3>
                <p>
                  Control various aspects of your planet's appearance, including
                  terrain type, color palette, atmosphere density, cloud
                  coverage, and more.
                </p>
              </div>
              <div className="feature-card">
                <h3>Multiple Biomes</h3>
                <p>
                  Create diverse planets with different biomes including
                  deserts, oceans, forests, ice caps, volcanic regions, and many
                  more.
                </p>
              </div>
              <div className="feature-card">
                <h3>Cloud Layers</h3>
                <p>
                  Add atmospheric detail with customizable cloud layers that can
                  be adjusted for density, altitude, and color.
                </p>
              </div>
              <div className="feature-card">
                <h3>Export & Share</h3>
                <p>
                  Save your creations as PNG files to use in other projects, or
                  share them directly with the Pixel Planets community.
                </p>
              </div>
              <div className="feature-card">
                <h3>Personal Gallery</h3>
                <p>
                  Keep track of all your created planets in your personal
                  gallery, where you can revisit and edit previous designs.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <p>
              Pixel Planets uses advanced algorithms to generate realistic
              planetary surfaces at a pixel level. Here's a simplified overview
              of the process:
            </p>
            <ol className="process-list">
              <li>
                Base shape generation using noise functions to create natural
                terrain variations
              </li>
              <li>
                Biome distribution based on latitude, elevation, and other
                parameters
              </li>
              <li>Color palette application according to selected themes</li>
              <li>Atmosphere and cloud layer rendering</li>
              <li>Detail pass to add features like craters or ocean waves</li>
              <li>Final rendering and optimization for web display</li>
            </ol>
            <p>
              The entire process happens in real-time in your browser, allowing
              for immediate feedback as you adjust parameters and settings.
            </p>
          </section>

          <section className="about-section team-section">
            <h2>About Me</h2>
            <p>
              Pixel Planets is a small project that I created with a friend to
              explore the possibilities of procedural generation in a web-based
              environment. We're passionate about art, technology, and games,
              and we wanted to combine those interests into a fun and accessible
              experience for everyone to enjoy.
            </p>
            <p>
              (As well as the beautiful code and shaders provided by{" "}
              <a href="https://deep-fold.itch.io/pixel-planet-generator">
                @deep-fold
              </a>
              )
            </p>

            <div className="team-member">
              <div
                className="member-avatar"
                style={{
                  background:
                    'url("/TemplateData/tobyavi.png") no-repeat center center / cover',
                }}
              />
              <h3 className="member-name">Tobes</h3>
              <p className="member-role">Creator of Pixel Planets</p>
              <p>
                Responsible for the design, development, and maintenance of
                Pixel Planets.
              </p>
            </div>
            <p>
              I'm constantly working to improve Pixel Planets and add new
              features. If you have suggestions or feedback, I'd love to hear
              from you!
            </p>
          </section>

          <form id="feedback-form">
            <label htmlFor="feedbackMessage">Your Feedback</label>
            <textarea id="feedbackMessage" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </main>

        <footer>&copy; 2023-2025 Pixel Planets. All rights reserved.</footer>
      </body>
    </html>
  );
}
