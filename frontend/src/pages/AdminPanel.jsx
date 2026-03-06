import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function AdminPanel() {
    const { id } = useParams(); // pega o user id da rota
    const [users, setUsers] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            
            // Buscar todos users
            const usersRes = await fetch(`${process.env.REACT_APP_API_URL}/api/users`);
            const usersData = await usersRes.json();
            setUsers(usersData);
            
            // Buscar drivers
            const driversRes = await fetch(`${process.env.REACT_APP_API_URL}/api/drivers`);
            const driversData = await driversRes.json();
            setDrivers(driversData);
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Tem certeza que quer deletar este utilizador?')) {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, { 
                    method: 'DELETE' 
                });
                if (res.ok) {
                    setUsers(users.filter(user => user._id !== userId));
                }
            } catch (error) {
                alert('Erro ao deletar utilizador');
            }
        }
    };

    if (loading) {
        return <div className="loading">Carregando...</div>;
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <h1>Painel Administrativo</h1>
                <p>ID do Admin: {id}</p>
            </header>

            {/* Estatísticas rápidas */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Usuários</h3>
                    <span>{users.length}</span>
                </div>
                <div className="stat-card">
                    <h3>Total Drivers</h3>
                    <span>{drivers.length}</span>
                </div>
            </div>

            {/* Lista de Usuários */}
            <section className="users-section">
                <h2>Gerenciar Usuários</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cargo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.cargo}</td>
                                <td>
                                    <button onClick={() => handleDeleteUser(user._id)}>
                                        Deletar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default AdminPanel;
