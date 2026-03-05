import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function TripHistoryPage() {
    const [viagens, setViagens] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const [filter, setFilter] = useState('all'); // 'all', 'today', 'week', 'month'

    const fetchViagens = async (period = 'all') => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`/api/trip/${id}/historico?period=${period}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            if (data.success) {
                setViagens(data.trips || []);
                
                // Calcular total
                const total = data.trips.reduce((sum, v) => {
                    return sum + parseFloat(v.earning || v.valor || 0);
                }, 0);
                setTotalEarnings(total);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchViagens(filter);
    }, [id, filter]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-PT') + ' ' + 
               new Date(dateString).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <Link 
                            to={`/user/${id}/driverEarnings`}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200"
                        >
                            ← Nova Viagem
                        </Link>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            📊 Histórico Completo
                        </h1>
                    </div>

                    {/* Total Card */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-2xl text-center mb-6">
                        <div className="text-lg font-semibold opacity-90">💰 Total Ganhos</div>
                        <div className="text-4xl font-black mb-1">{totalEarnings.toFixed(2)} €</div>
                        <div className="text-emerald-100 text-sm">
                            {viagens.length} viagem{viagens.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-2 justify-center">
                        {['today', 'week', 'month', 'all'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setFilter(period)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                                    filter === period
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white/50 text-gray-700 hover:bg-white hover:shadow-md'
                                }`}
                            >
                                {period === 'today' && '📅 Hoje'}
                                {period === 'week' && '📆 Semana'}
                                {period === 'month' && '📅 Mês'}
                                {period === 'all' && '📋 Todas'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-xl text-gray-600">A carregar histórico...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-8 rounded-2xl text-center">
                            ❌ {error}
                        </div>
                    ) : viagens.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-3xl flex items-center justify-center">
                                <span className="text-4xl">📭</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Nenhuma viagem encontrada</h3>
                            <p>{filter === 'today' ? 'Hoje ainda não registou viagens.' : 'Não existem viagens registadas.'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {viagens.map((v) => (
                                <div
                                    key={v._id || v.id}
                                    className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-200"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-gray-800 truncate">{v.description || 'Viagem'}</h3>
                                            <p className="text-sm text-gray-500">{formatDate(v.date)}</p>
                                        </div>
                                        <div className="text-right ml-4 flex-shrink-0">
                                            <div className="text-2xl font-black text-green-600">
                                                {parseFloat(v.earning || v.valor || 0).toFixed(2)} €
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripHistoryPage;
