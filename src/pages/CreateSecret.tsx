import React, { useState } from "react";

const CreateSecret: React.FC = () => {
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [link, setLink] = useState("");

  const createSecret = async () => {
    const res = await fetch("http://localhost:4000/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, password }),
    });
    const data = await res.json();
    setLink(data.link);
  };

  return (
    
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img src="/Logo.png" alt="logo" style={{ height: 50 }} />
        </div>

        {/* Tiêu đề */}
        <h5 className="text-center mb-3">Create your secret link</h5>

        {/* Dòng kẻ */}
        <hr style={{ width: "100%", margin: "1rem auto", borderColor: "#ccc" }} />

        {/* Form nhập secret */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Enter your secret..."
            rows={3}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </div>

        {/* Form nhập password + nút tạo link */}
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
            onClick={createSecret}
            style={{
              backgroundColor: "#f9cd55",
              color: "#000",
              fontWeight: 500,
            }}
          >
            <i className="fa fa-lock me-2" />
            Create link
          </button>
        </div>

        {/* Ghi chú */}
        <div className="alert alert-warning small mb-0">
          <strong>Note:</strong> The link will be available for one-time use only. Make sure you save it securely.
        </div>

        {/* Link tạo thành công (style giống view secret) */}
        {link && (
          <div className="position-relative mt-3">
            <pre
              className="bg-light border rounded p-3"
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word"
              }}
            >
              Secret link created:
              {"\n"}
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </pre>

          
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSecret;
