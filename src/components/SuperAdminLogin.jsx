import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminLogin.css";
import usePageTitle from '../usePageTitle';
import ptagLogo from '../assets/PTag.png';

const BASE_URL = "https://anpr-api.gconnectt.com";

const SuperAdminLogin = () => {
  usePageTitle("Super-Admin Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate                = useNavigate();
  const canvasRef               = useRef(null);

  // ── Particle network ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const DOTS = 60;
    const dots = Array.from({ length: DOTS }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 2 + 1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < DOTS; i++) {
        for (let j = i + 1; j < DOTS; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,58,58,${0.16 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139,58,58,0.35)";
        ctx.fill();
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Password-only frontend login. The API must return a token directly.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/super-admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password })
      });
      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      if (data.token) {
        localStorage.setItem("superAdminToken", data.token);
        navigate("/super-admin/dashboard");
        return;
      }

      if (data.otpRequired === true || data.otpRequired === "true") {
        setError("The server still requires OTP. Password-only login must also be enabled on the backend.");
      } else {
        setError(data.error || "The server did not return a login token.");
      }
    } catch (err) {
      console.error("Super Admin login error:", err);
      setError("Unable to connect to the login server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salog-wrapper">
      <canvas ref={canvasRef} className="salog-canvas" />

      {/* NAVBAR */}
      <nav className="salog-navbar">
        <a href="#" className="salog-nav-logo">
          <img src={ptagLogo} alt="PTag Logo" className="salog-nav-logo-img" />
          <div className="salog-nav-logo-text">
            <span className="ptag-bold">P</span>
            <span className="ptag-thin">Tag</span>
          </div>
        </a>
        <span className="salog-nav-title">Super Admin Command Center</span>
        <div style={{ width: 120 }} />
      </nav>

      {/* CARD */}
      <div className="salog-body">
        <div className="salog-card">

          <h2 className="salog-title">Super Admin Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="salog-field">
              <label>Username</label>
              <div className="salog-input-wrap">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
                <span className="salog-input-icon">👤</span>
              </div>
            </div>

            <div className="salog-field">
              <label>Password</label>
              <div className="salog-input-wrap">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <span className="salog-input-icon">🔒</span>
              </div>
            </div>

            {error && <p className="salog-error">{error}</p>}

            <button type="submit" className="salog-btn-login" disabled={loading}>
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;