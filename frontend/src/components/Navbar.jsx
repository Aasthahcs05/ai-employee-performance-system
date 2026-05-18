import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Employee AI System</h2>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Navbar;