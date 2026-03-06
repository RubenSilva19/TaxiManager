import { useState } from "react";

function SignupPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [apelido, setApelido] = useState("");
    const [cargo, setCargo] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(nome, apelido, email, password, cargo);
        fetch(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `${nome} ${apelido}`, email, password, cargo })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("Registo Feito com Sucesso");
            } else {
                alert("Erro ao fazer registo: " + data.message);
            }
        });

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                className="w-full max-w-sm bg-white rounded-lg shadow-md p-6 space-y-4">
                <h1 className="text-2xl font-semibold text-center">Registo</h1>

                <div className="space-y-1">
                    <label className="block text-sm font-medium">Nome</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={nome}
                        placeholder="taxi"
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium">Apelido</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={apelido}
                        placeholder="manager"
                        onChange={(e) => setApelido(e.target.value)}
                    />
                </div>

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
                    <label className="block text-sm font-medium">Palavra-Passe</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium">Cargo</label>
                    <select
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        
                    </select>
                </div>

                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Registar
                </button>
            </form>
        </div>
    );
}

export default SignupPage;