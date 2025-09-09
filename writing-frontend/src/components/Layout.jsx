import Navbar from "./navbar";

function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      {/* Add padding-top to prevent content from hiding under navbar */}
      <main className="pt-20 px-6">{children}</main>
    </div>
  );
}

export default Layout;
