import React, { useState } from "react";

const BLUE = "#1A3C6E";
const YELLOW = "#F9CD55";
const BG = "#EEF2F7";

const CreateSecret: React.FC = () => {
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [maxViews, setMaxViews] = useState(3);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createSecret = async () => {
    if (!secret.trim()) { setError("Please enter a secret message."); return; }
    if (!password.trim()) { setError("Please enter a password."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, password, maxViews }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const text = await res.text();
      if (!text) throw new Error("Empty response from server");
      const data = JSON.parse(text);
      if (!data.token) throw new Error("Invalid response: missing token");
      const fullLink = `${window.location.origin}${import.meta.env.BASE_URL}view/${data.token}`;
      setLink(fullLink);
      setSecret("");
      setPassword("");
    } catch (err) {
      console.error("Create secret error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", display: "flex", flexDirection: "column" }}>
      {/* Hero header */}
      <header style={{
        background: `linear-gradient(135deg, ${BLUE} 0%, #2563EB 100%)`,
        padding: "32px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <img src={`${import.meta.env.BASE_URL}logo2.png`} alt="logo" style={{ height: 80, marginBottom: 12 }} />

      </header>

      {/* Main */}
      <main style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 16px 32px" }}>
        <div style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(26,60,110,0.12)",
          padding: "40px 36px",
          width: "100%",
          maxWidth: 520,
        }}>
          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: YELLOW, display: "inline-flex",
              alignItems: "center", justifyContent: "center",
              marginBottom: 12, boxShadow: "0 4px 12px rgba(249,205,85,0.4)"
            }}>
              <i className="fa fa-lock" style={{ fontSize: 22, color: BLUE }} />
            </div>
            <h4 style={{ color: BLUE, fontWeight: 700, margin: 0 }}>Create a Secret Link</h4>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              Your link is encrypted and shared via a one-time link.
            </p>
          </div>

          {/* Secret textarea */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
              Secret Link
            </label>
            <textarea
              rows={4}
              placeholder="Write your confidential message here..."
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              style={{
                width: "100%", borderRadius: 10, border: "1.5px solid #d1d5db",
                padding: "10px 14px", fontSize: 14, resize: "vertical",
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = BLUE)}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Set a password for this secret..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%", borderRadius: 10, border: "1.5px solid #d1d5db",
                  padding: "10px 42px 10px 14px", fontSize: 14,
                  outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = BLUE)}
                onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0,
                }}
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
          </div>

          {/* Max views */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
              Max Views Allowed
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => setMaxViews(v => Math.max(1, v - 1))}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${BLUE}`,
                  background: "#EEF2F7", color: BLUE, fontWeight: 700, fontSize: 18,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >−</button>
              <input
                type="number"
                min={1}
                max={100}
                value={maxViews}
                onChange={(e) => setMaxViews(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                style={{
                  width: 64, textAlign: "center", borderRadius: 10,
                  border: "1.5px solid #d1d5db", padding: "8px 4px",
                  fontSize: 15, fontWeight: 600, color: BLUE, outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setMaxViews(v => Math.min(100, v + 1))}
                style={{
                  width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${BLUE}`,
                  background: "#EEF2F7", color: BLUE, fontWeight: 700, fontSize: 18,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >+</button>
              <span style={{ fontSize: 13, color: "#6b7280" }}>times</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
              padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#B91C1C",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <i className="fa fa-exclamation-circle" /> {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="button"
            onClick={createSecret}
            disabled={loading}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
              background: YELLOW, color: BLUE, fontWeight: 700, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
              letterSpacing: 0.3, transition: "opacity 0.2s",
              boxShadow: "0 4px 14px rgba(249,205,85,0.45)",
            }}
          >
            {loading ? (
              <><i className="fa fa-spinner fa-spin me-2" />Generating...</>
            ) : (
              <><i className="fa fa-link me-2" />Generate Secret Link</>
            )}
          </button>

          {/* Info note */}
          <div style={{
            marginTop: 16, background: "#EFF6FF", borderRadius: 10,
            padding: "10px 14px", fontSize: 12, color: "#1e40af",
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <i className="fa fa-info-circle" style={{ marginTop: 2, flexShrink: 0 }} />
            <span>This secret will self-destruct after <strong>{maxViews}</strong> view{maxViews !== 1 ? "s" : ""}. Share the link and password separately for maximum security.</span>
          </div>

          {/* Success - link result */}
          {link && (
            <div style={{
              marginTop: 24, background: "#F0FDF4", border: "1.5px solid #86EFAC",
              borderRadius: 12, padding: "18px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <i className="fa fa-check-circle" style={{ color: "#16a34a", fontSize: 18 }} />
                <span style={{ fontWeight: 700, color: "#15803d", fontSize: 14 }}>Secret link created!</span>
              </div>
              <div style={{
                background: "#fff", borderRadius: 8, border: "1px solid #d1fae5",
                padding: "10px 12px", wordBreak: "break-all", fontSize: 13, color: "#374151",
              }}>
                <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: BLUE, textDecoration: "underline" }}>
                  {link}
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  marginTop: 10, padding: "8px 18px", borderRadius: 8, border: "none",
                  background: copied ? "#16a34a" : BLUE, color: "#fff",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "background 0.2s",
                }}
              >
                <i className={`fa ${copied ? "fa-check" : "fa-copy"} me-2`} />
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "14px", color: "#9ca3af", fontSize: 12 }}>
        SecretLink — Secure one-time secret sharing
      </footer>
    </div>
  );
};

export default CreateSecret;
