import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ViewSecret: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [viewsLeft, setViewsLeft] = useState<number | null>(null);
  const [error, setError] = useState("");

  const viewSecret = async () => {
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
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header navbar */}
      <div style={{ background: "#f9cd55", padding: "10px 20px" }}>
        <div className="d-flex justify-content-center align-items-center">
          <img src={`${import.meta.env.BASE_URL}logo2.png`} alt="msc" style={{ height: 50 }} />
        </div>
      </div>

      {/* Main card */}
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
          <div className="text-center mb-3">
            <img src={`${import.meta.env.BASE_URL}Logo.png`} alt="msc" style={{ height: 40 }} />
            <h5 className="mt-3">You have received the following secret</h5>
          </div>
          <hr style={{ width: "100%", margin: "1rem auto", borderColor: "#8d8888ff" }} />

          <p className="text-center text-muted">Enter the password to view the secret:</p>

          <div className="input-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn"
              type="button"
              onClick={viewSecret}
              style={{
                backgroundColor: "#f3cb5eff",
                color: "#000",
                fontWeight: 500
              }}
            >
              <i className="fa fa-eye me-2" />
              View secret
            </button>
          </div>
     
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          {secret && (
            <>
            {viewsLeft !== null && viewsLeft > 0 && (
              <div className="alert alert-info small mt-3">
                This secret can be viewed <strong>{viewsLeft}</strong> more time{viewsLeft !== 1 ? "s" : ""}.
              </div>
            )}
            {viewsLeft === 0 && (
              <div className="alert alert-warning small mt-3">
                This was the <strong>last</strong> view. The secret has been deleted.
              </div>
            )}
            <div className="position-relative">
              <pre
                className="bg-light border rounded p-3"
                style={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word"
                }}
              >
                {secret}
              </pre>

              <button
                className="btn btn-outline-secondary btn-sm position-absolute"
                style={{ top: 10, right: 10 }}
                onClick={() => navigator.clipboard.writeText(secret)}
              >
                <i className="fa fa-copy me-1" />
                Copy
              </button>
            </div>
            </>
          )}

          <div className="alert alert-warning mt-4 small">
            <strong>Note:</strong> Make sure you copy the secret to a safe place right away. Secrets will normally be available only for one time and the link will expire.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSecret;
