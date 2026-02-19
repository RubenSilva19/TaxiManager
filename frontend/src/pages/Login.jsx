import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedEmail = Cookies.get("email") || "";
    const savedPassword = Cookies.get("password") || "";
    setEmail(savedEmail);
    setPassword(savedPassword);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Cookies.set("email", email)
    Cookies.set("password", password)
    alert("Login Sucessful")
  };

  const checkUser = async (formData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const newUser = await response.json();
      setUsers([...users, newUser]); // Optimistic update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-center">Taxi Manager</h1>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            placeholder="taxi@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
        <Link to="/signup">
          <button
            type="button"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Registar
          </button>
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;
