import { useState } from "react";
import Login from "./components/Login.jsx";
import Students from "./components/Students.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const onLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };
  const onLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? <Students onLogout={onLogout} /> : <Login onLogin={onLogin} />;
}
