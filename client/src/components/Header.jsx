import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch(`${baseURL}/profile`, {
      credentials: "include",
    }).then((response) => {
      response
        .json()
        .then((userInfo) => {
          setUserInfo(userInfo);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          // Handle the error, e.g., redirect to a login page
        });
    });
  }, []);

  function logout() {
    fetch(`${baseURL}/logout`, {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const userName = userInfo?.userName;

  let name = userName;
  if (name && name.length > 7) {
    name = name.split(" ")[0].concat("..");
  }

  return (
    <header>
      <Link className="logo" to="/">
        WeBlog
      </Link>
      {userName && (
        <nav>
          <p>Welcome, {name}!</p>
          <Link to="/create">create new Post</Link>
          <Link to="/" onClick={logout}>
            Logout
          </Link>
        </nav>
      )}
      {!userName && (
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      )}
    </header>
  );
}
