import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await axios.get('http://localhost:8080/api/superadmin/users');
            setUsers(res.data);
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h3>Global User Directory</h3>
            <div style={styles.grid}>
                {users.map(user => (
                    <div key={user.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <strong>{user.full_name || 'N/A'}</strong>
                            <span style={styles.roleBadge}>{user.role || 'USER'}</span>
                        </div>
                        <p style={styles.detail}>Email: {user.email}</p>
                        <p style={styles.detail}>Organization: {user.org_name || 'System (RKT)'}</p>
                        <div style={styles.actions}>
                            <button style={styles.btnEdit}>Edit</button>
                            <button style={styles.btnDelete}>Deactivate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    card: { backgroundColor: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #eee' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    roleBadge: { fontSize: '10px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' },
    detail: { fontSize: '13px', margin: '4px 0', color: '#555' },
    actions: { marginTop: '15px', display: 'flex', gap: '10px' },
    btnEdit: { flex: 1, padding: '6px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' },
    btnDelete: { flex: 1, padding: '6px', cursor: 'pointer', borderRadius: '4px', border: 'none', background: '#ffebee', color: '#c62828' }
};

export default UserManagement;