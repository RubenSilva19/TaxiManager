import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DriverEarningsPage() {
    const [inputEarning, setInputEarning] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [viagens, setViagens] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputEarning || parseFloat(inputEarning) <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/trip/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userID: id,
                    earning: parseFloat(inputEarning),
                    description: inputDescription,
                    date: new Date().toISOString(),
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                alert('✅ Viagem registada com sucesso!');
                setInputEarning('');
                setInputDescription('');
                fetchViagens(); // Refresh list
            } else {
                alert('❌ Erro: ' + (data.message || 'Erro desconhecido'));
            }
        } catch (err) {
            console.error('Erro ao registar:', err);
            setError('Erro ao comunicar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const fetchViagens = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/trip/${id}/dailylogs`);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                setViagens(data.trips || []);
                const total = data.trips.reduce((sum, v) => {
                    return sum + parseFloat(v.earning || v.valor || 0);
                }, 0);
                setTotalEarnings(total);
            } else {
                setError(data.message || 'Erro ao carregar histórico');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Erro ao carregar histórico');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchViagens();
        }
    }, [id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <form
                className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 space-y-6"
                onSubmit={handleSubmit}
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Registo de Viagem
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Motorista ID: {id?.slice(-6) || 'N/A'}</p>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">💰 Valor (€)</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        value={inputEarning}
                        placeholder="0.00"
                        onChange={(e) => setInputEarning(e.target.value)}
                        min={0}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">📝 Descrição</label>
                    <input
                        type="text"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        value={inputDescription}
                        placeholder="Ex: Lisboa → Porto"
                        onChange={(e) => setInputDescription(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !inputEarning}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    {loading ? '⏳ A registar...' : '🚀 Registar Viagem'}
                </button>

                {/* Loading/Error States */}
                {loading && (
                    <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
                        ❌ {error}
                    </div>
                )}

                {/* History Section */}
                <div className="w-full mt-8 pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        📊
                        <span>Histórico de Viagens</span>
                        <button 
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        onClick={() => navigate(`/${id}/historico`)}>
                            Ver Todos
                        </button>
                    </h2>
                    {viagens.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                                📭
                            </div>
                            <p>Nenhuma viagem registada ainda.</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-xl border border-gray-200">
                            {viagens.slice(0, 5).map((v) => (
                                <div
                                    key={v._id || v.id}
                                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 flex justify-between items-center hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 hover:shadow-md"
                                >
                                    <span className="text-gray-700 font-medium truncate max-w-[60%]">
                                        {v.description || 'Sem descrição'}
                                    </span>
                                    <span className="font-bold text-green-600 text-lg bg-green-100 px-3 py-1 rounded-full">
                                        {parseFloat(v.earning || v.valor || 0).toFixed(2)} €
                                    </span>
                                </div>
                            ))}
                            {viagens.length > 5 && (
                                <div className="text-center text-sm text-gray-500 py-3 border-t bg-white/50">
                                    +{viagens.length - 5} mais...
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg mb-6 text-center max-w-sm mx-auto">
                        <div className="text-sm font-semibold mb-1 opacity-90">💰 Total Ganhos</div>
                        <div className="text-2xl font-bold">{totalEarnings.toFixed(2)} €</div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default DriverEarningsPage;
