import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/auth";
import { useAuth } from "../lib/AuthContext";

// ── Login styles ──────────────────────────────────────────────────────────────

const LOGIN_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', Arial, sans-serif; }
`;

function LoginStyles() { return <style>{LOGIN_CSS}</style>; }

// ── Input ─────────────────────────────────────────────────────────────────────

function Input({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6,
        letterSpacing: ".05em", textTransform: "uppercase", color: "#fff",
      }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", borderRadius: 8,
          border: "none", outline: "none", fontSize: 14,
          background: "#fff", color: "#111",
        }}
      />
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { setCurrentUser } = useAuth();

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      const user = await login(username, password);
      setCurrentUser({ id: user.id, username: user.username, role: user.role });
      if (user.role === "admin") navigate("/admin");
      else navigate("/language");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LoginStyles />
      <div style={{
        minHeight: "100vh", background: "#f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}>
        <div style={{
          background: "#cc0000", borderRadius: 18, padding: "40px 32px",
          width: "100%", maxWidth: 360, boxShadow: "0 8px 40px #0003",
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* Logo */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14, boxShadow: "0 2px 8px #0002",
          }}>
            <span style={{ color: "#cc0000", fontWeight: 800, fontSize: 16, letterSpacing: "-.5px" }}>regcris</span>
          </div>

          <p style={{ color: "#fff", fontSize: 14, marginBottom: 24, marginTop: 0, fontWeight: 500 }}>
            User Management Portal
          </p>

          {/* Fields */}
          <div style={{ width: "100%" }} onKeyDown={e => e.key === "Enter" && handleLogin()}>
            <Input label="Username" value={username} onChange={setUsername} placeholder="Username" />
            <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="Password" />
          </div>

          {error && (
            <p style={{ color: "#ffd6d6", fontSize: 12, margin: "0 0 12px", textAlign: "center" }}>{error}</p>
          )}

          <button onClick={handleLogin} disabled={loading} style={{
            width: "100%", padding: "12px 0", background: "#ff7700", border: "none",
            borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 15,
            cursor: "pointer", boxShadow: "0 2px 8px #ff770055", opacity: loading ? 0.7 : 1,
          }}>{loading ? "Logging in..." : "Log in"}</button>
        </div>
      </div>
    </>
  );
}