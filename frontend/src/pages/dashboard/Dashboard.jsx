import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as dashboardService from '../../services/dashboardService';

function StatCard({ title, value }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <div className="stat-value">{value}</div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth() || {};
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
        fn()
            .then((res) => setData(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    return (
        <div>
            <h2>Dashboard</h2>
            {loading && <div>Loading...</div>}
            {!loading && data && (
                <>
                    <div className="grid">
                        <StatCard title="Projects" value={data.totals?.projects ?? data.totals?.assignedProjects ?? 0} />
                        <StatCard title="Tasks" value={data.totals?.tasks ?? data.totals?.assignedTasks ?? 0} />
                        <StatCard title="Overdue" value={data.overdueTasks ?? 0} />
                        <StatCard title="Task Assignments" value={data.totals?.taskAssignments ?? 0} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <h3>Task Status</h3>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            {Object.entries(data.taskStatus || {}).map(([k, v]) => (
                                <div key={k} className="card small">
                                    <div style={{ textTransform: 'capitalize' }}>{k}</div>
                                    <div className="stat-value">{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <h3>Overdue Tasks</h3>
                        <div>
                            {/* Backend returns counts; for details we'd need a dedicated endpoint; show count for now */}
                            <div>Overdue tasks: {data.overdueTasks ?? 0}</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
