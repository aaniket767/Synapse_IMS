import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdLogout,
  MdPeople,
  MdSchool,
  MdCurrencyRupee,
  MdAnalytics,
} from "react-icons/md";
import { supabase } from "../services/supabase";

function MainLayout({ children }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single();

        console.log("Auth User Id:", user.id);
        console.log("Profile Data:", data);
        console.log("Profile Error:", error);

        if (!error) {
          setProfile(data);
        }
      }
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const closeSidebarOnMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="layout">
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-toggle-trigger"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? "✕ Menu" : "☰ Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isMobileOpen ? "mobile-expanded" : "mobile-collapsed"
        }`}
      >
        {/* Logo */}
        <div className="logo-container">
          <img src="/logo.png" alt="SWC Logo" className="sidebar-logo" />
        </div>

        {/* Navigation */}
        <nav>
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={closeSidebarOnMobile}
          >
            <MdDashboard />
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/students"
            className={`nav-link ${
              location.pathname.startsWith("/students") ? "active" : ""
            }`}
            onClick={closeSidebarOnMobile}
          >
            <MdPeople />
            <span className="nav-text">Students</span>
          </Link>

          <Link
            to="/teachers"
            className={`nav-link ${
              location.pathname === "/teachers" ? "active" : ""
            }`}
            onClick={closeSidebarOnMobile}
          >
            <MdSchool />
            <span className="nav-text">Teachers</span>
          </Link>

          <Link
            to="/fees"
            className={`nav-link ${
              location.pathname === "/fees" ? "active" : ""
            }`}
            onClick={closeSidebarOnMobile}
          >
            <MdCurrencyRupee />
            <span className="nav-text">Fees</span>
          </Link>

          <Link
            to="/reports"
            className={`nav-link ${
              location.pathname === "/reports" ? "active" : ""
            }`}
            onClick={closeSidebarOnMobile}
          >
            <MdAnalytics />
            <span className="nav-text">Billing</span>
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="profile-info">
              <div className="user-name">
                {profile?.full_name || "Loading..."}
              </div>

              <div className="user-role">{profile?.role || ""}</div>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            > 
              <MdLogout size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export default MainLayout;
