import React, { useState } from "react";

const CreateSecret: React.FC = () => {
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [maxViews, setMaxViews] = useState(3);
  const [link, setLink] = useState("");

const createSecret = async () => {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}api/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ secret, password, maxViews }),
    });

    // ❗ check HTTP status
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    // ❗ đọc text trước để tránh crash
    const text = await res.text();

    if (!text) {
      throw new Error("Empty response from server");
    }

    const data = JSON.parse(text);

    // ❗ check data hợp lệ
    if (!data.token) {
      throw new Error("Invalid response: missing token");
    }

    const fullLink = `${window.location.origin}${import.meta.env.BASE_URL}view/${data.token}`;
    setLink(fullLink);
  } catch (err) {
    console.error("Create secret error:", err);
    alert("Có lỗi xảy ra khi tạo secret ❗");
  }
};

  return (
    
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: "500px" }}>
        {/* Logo */}
        <div className="text-center mb-3">
          <img src={`${import.meta.env.BASE_URL}Logo.png`} alt="logo" style={{ height: 50 }} />
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

        {/* Số lần xem tối đa */}
        <div className="mb-3">
          <label className="form-label small fw-semibold">Max views allowed</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={100}
            value={maxViews}
            onChange={(e) => setMaxViews(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
          />
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
