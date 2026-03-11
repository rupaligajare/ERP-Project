import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrgDirectory = () => {
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        const fetchOrgs = async () => {
            const res = await axios.get('http://localhost:8080/api/superadmin/organizations');
            setOrgs(res.data);
        };
        fetchOrgs();
    }, []);

    return (
        <div style={styles.container}>
            <h3>Client Organization Directory</h3>
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Company Name</th>
                            <th>JDE Environment</th>
                            <th>AIS Gateway</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orgs.map(org => (
                            <tr key={org.id}>
                                <td>{org.id}</td>
                                <td><strong>{org.org_name}</strong></td>
                                <td><span style={styles.badge}>{org.jde_env}</span></td>
                                <td style={styles.urlText}>{org.jde_ais_url}</td>
                                <td style={{color: org.status === 'ACTIVE' ? 'green' : 'red'}}>
                                    ● {org.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    tableWrapper: { overflowX: 'auto' }, // Makes it mobile-friendly
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    badge: { background: '#e1f5fe', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
    urlText: { fontSize: '12px', color: '#666', fontFamily: 'monospace' }
};

export default OrgDirectory;