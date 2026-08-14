export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-inner">
          <span className="logo">Booking Platform</span>
          <nav className="nav">
            <a href="/">Home</a>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>Customers browse services · Providers manage availability</p>
        </div>
      </footer>
    </div>
  );
}
