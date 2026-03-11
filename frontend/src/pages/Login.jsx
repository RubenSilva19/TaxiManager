import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = Cookies.get("email") || "";
    const savedPassword = Cookies.get("password") || "";
    setEmail(savedEmail);
    setPassword(savedPassword);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log('🌐 API URL:', import.meta.env.VITE_API_URL);
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // 🆕 DEBUG: Log EVERYTHING about the response
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    console.log('📊 OK:', response.ok);
    
    // 🆕 See RAW response before parsing
    const rawResponse = await response.text();
    console.log('📄 RAW Response:', rawResponse);

    // 🆕 Check if response is empty
    if (!rawResponse) {
      throw new Error('Server returned empty response');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${rawResponse || 'No details'}`);
    }

    const data = JSON.parse(rawResponse); // Manual parse after checking
    console.log("✅ Parsed data:", data);

    if (data.success) {
      alert("✅ Login realizado com sucesso!");
      if (data.user.cargo === "admin") {
        navigate(`/admin/${data.user.id}/panel`);
      } else {
        navigate(`/user/${data.user.id}/driverEarnings`);
      }
    } else {
      alert("❌ Erro no login: " + (data.message || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    alert("❌ Erro: " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <form
        className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🚕 TaxiManager
          </h1>
          <p className="text-sm text-gray-500">Bem-vindo de volta!</p>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            ✉️ Email
          </label>
          <input
            type="email"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
            value={email}
            placeholder="motorista@taxi.com"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
            🔒 Palavra-Passe
          </label>
          <input
            type="password"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50"
            value={password}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Entrando...
            </>
          ) : (
            '🚀 Entrar'
          )}
        </button>

        <Link to="/signup">
          <button
            type="button"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-green-200/50"
          >
            📝 Registar Nova Conta
          </button>
        </Link>

        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </form>
    </div>
  );
}

export default LoginPage;
