export const metadata = {
  title: "RandomKick",
  description: "Find random Kick.com streams instantly",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "#0f0f0f", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
          {children}
        </div>
      </body>
    </html>
  );
}