import React, { useState } from "react";
import { useParams } from "react-router-dom";

const BLUE = "#1A3C6E";
const YELLOW = "#F9CD55";
const BG = "#EEF2F7";

const ViewSecret: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [secret, setSecret] = useState("");
  const [viewsLeft, setViewsLeft] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const viewSecret = async () => {
    if (!password.trim()) { setError("Please enter the password."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/view/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error");
        setSecret("");
        setViewsLeft(null);
      } else {
        setSecret(data.secret);
        setViewsLeft(data.viewsLeft);
        setError("");
      }
    } catch {
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
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
              <i className="fa fa-envelope-open" style={{ fontSize: 22, color: BLUE }} />
            </div>
            <h4 style={{ color: BLUE, fontWeight: 700, margin: 0 }}>You Have a Secret</h4>
            <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
              Enter the password provided by the sender to reveal the message.
            </p>
          </div>

          {/* Revealed secret */}
          {secret ? (
            <div style={{ marginBottom: 20 }}>
              {/* Views left badge */}
              {viewsLeft !== null && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: viewsLeft === 0 ? "#FEF2F2" : "#EFF6FF",
                  border: `1px solid ${viewsLeft === 0 ? "#FECACA" : "#BFDBFE"}`,
                  borderRadius: 20, padding: "5px 14px", marginBottom: 14,
                  fontSize: 12, fontWeight: 600,
                  color: viewsLeft === 0 ? "#B91C1C" : BLUE,
                }}>
                  <i className={`fa ${viewsLeft === 0 ? "fa-trash" : "fa-eye"}`} />
                  {viewsLeft === 0
                    ? "Secret deleted — this was the last view"
                    : `${viewsLeft} view${viewsLeft !== 1 ? "s" : ""} remaining`}
                </div>
              )}

              {/* Secret content */}
              <div style={{
                background: "#F8FAFC", border: `1.5px solid #E2E8F0`,
                borderRadius: 12, padding: "16px 48px 16px 16px",
                position: "relative", minHeight: 80,
              }}>
                <pre style={{
                  margin: 0, fontFamily: "monospace", fontSize: 14,
                  whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#1e293b",
                }}>
                  {secret}
                </pre>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy to clipboard"
                  style={{
                    position: "absolute", top: 10, right: 10,
                    padding: "5px 10px", borderRadius: 7, border: "none",
                    background: copied ? "#16a34a" : BLUE,
                    color: "#fff", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", transition: "background 0.2s",
                  }}
                >
                  <i className={`fa ${copied ? "fa-check" : "fa-copy"} me-1`} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Password input */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLUE, marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter the password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && viewSecret()}
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

              {/* View button */}
              <button
                type="button"
                onClick={viewSecret}
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
                  <><i className="fa fa-spinner fa-spin me-2" />Decrypting...</>
                ) : (
                  <><i className="fa fa-unlock me-2" />Reveal Secret</>
                )}
              </button>
            </>
          )}

          {/* Security note */}
          <div style={{
            marginTop: 20, background: "#EFF6FF", borderRadius: 10,
            padding: "10px 14px", fontSize: 12, color: "#1e40af",
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <i className="fa fa-shield" style={{ marginTop: 2, flexShrink: 0 }} />
            <span>Copy the secret to a safe place immediately. It may be deleted after reaching its view limit.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "14px", color: "#9ca3af", fontSize: 12 }}>
        SecretLink — Secure one-time secret sharing
      </footer>
    </div>
  );
};

export default ViewSecret;
