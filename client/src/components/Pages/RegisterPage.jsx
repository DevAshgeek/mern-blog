import { useState } from "react";
const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function register(ev) {
    ev.preventDefault();

    const responses = await fetch(`${baseURL}/register`, {
      method: "POST",
      body: JSON.stringify({ userName, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (responses.status === 200) {
      alert("Registration successful");
    } else if (responses.status === 409) {
      alert("Username already exists. Please choose another.");
    } else {
      alert("Registration failed. Please try again later.");
    }
  }

  return (
    <div className="register-container">
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Enter your Name"
          value={userName}
          onChange={(ev) => setUserName(ev.target.value)}
        />
        <input
          type="password"
          placeholder="Enter new Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Register</button>
      </form>
      <div className="register-sidebar"></div>
    </div>
  );
}
