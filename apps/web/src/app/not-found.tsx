import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#FEFDFB" }}>
      <div style={{ textAlign: "center", padding: "24px" }}>
        <h1 style={{ fontSize: "72px", fontWeight: "bold", color: "#6366F1", marginBottom: "16px" }}>404</h1>
        <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#1f2937", marginBottom: "8px" }}>
          Page not found
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "32px", maxWidth: "400px" }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#6366F1", color: "white", borderRadius: "12px", fontWeight: 500, textDecoration: "none" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
