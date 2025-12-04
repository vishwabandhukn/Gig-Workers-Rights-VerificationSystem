import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
    const [fairness, setFairness] = useState({
        score: 100,
        components: {
            payment: 100,
            suspension: 100,
            rating: 100,
            disputes: 100
        }
    });
    const [anomalies, setAnomalies] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const fairnessRes = await api.get(`/fairness/${user._id}`);
                setFairness(fairnessRes.data);

                const anomaliesRes = await api.get(`/anomalies/${user._id}`);
                setAnomalies(anomaliesRes.data.items);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard data. Please try again.");
            }
        };
        if (user._id) fetchData();
    }, [user._id]);

    const handleAcknowledge = async (id) => {
        try {
            await api.post('/anomalies/acknowledge', { anomalyId: id });
            toast.success('Anomaly acknowledged');
            setAnomalies(anomalies.filter(a => a._id !== id));
        } catch (err) {
            toast.error('Failed to acknowledge');
        }
    };

    const chartData = fairness ? {
        labels: ['Payment', 'Suspension', 'Rating', 'Disputes'],
        datasets: [
            {
                label: 'Fairness Components',
                data: [
                    fairness.components.payment,
                    fairness.components.suspension,
                    fairness.components.rating,
                    fairness.components.disputes,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    } : null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link to="/evidence" className="card bg-primary text-primary-content hover:bg-primary-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Evidence Locker</h2>
                            <p>Upload and manage secure evidence.</p>
                        </div>
                    </Link>
                    <Link to="/payouts" className="card bg-secondary text-secondary-content hover:bg-secondary-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Verify Payouts</h2>
                            <p>Check for payment discrepancies.</p>
                        </div>
                    </Link>
                    <Link to="/disputes" className="card bg-accent text-accent-content hover:bg-accent-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Dispute Center</h2>
                            <p>Generate appeals and manage cases.</p>
                        </div>
                    </Link>
                    <Link to="/risk" className="card bg-neutral text-neutral-content hover:bg-neutral-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Risk Assessment</h2>
                            <p>Predict and mitigate suspension risk.</p>
                        </div>
                    </Link>
                    <Link to="/trips" className="card bg-info text-info-content hover:bg-info-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Log Trips</h2>
                            <p>Track your rides and earnings.</p>
                        </div>
                    </Link>
                    <Link to="/ratings" className="card bg-warning text-warning-content hover:bg-warning-focus transition-colors">
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">Rate Platform</h2>
                            <p>Share your experience.</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Fairness Score</h2>
                        <h2 className="card-title">Fairness Score</h2>
                        {error ? (
                            <div className="alert alert-error">
                                <span>{error}</span>
                            </div>
                        ) : fairness ? (
                            <div className="flex flex-col items-center">
                                <div className="radial-progress text-primary" style={{ "--value": fairness.score, "--size": "12rem", "--thickness": "2rem" }}>{fairness.score}%</div>
                                <div className="mt-4 w-full max-w-xs">
                                    <Doughnut data={chartData} />
                                </div>
                            </div>
                        ) : <p>Loading...</p>}
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Anomalies Detected</h2>
                        {anomalies.length > 0 ? (
                            <ul className="menu bg-base-200 w-full rounded-box">
                                {anomalies.map((anomaly) => (
                                    <li key={anomaly._id} className="flex flex-row justify-between items-center p-2">
                                        <div className="flex-1">
                                            <div className="badge badge-error gap-2 mr-2">
                                                {anomaly.type}
                                            </div>
                                            <span className="text-sm">{anomaly.details && JSON.stringify(anomaly.details)}</span>
                                        </div>
                                        <button onClick={() => handleAcknowledge(anomaly._id)} className="btn btn-xs btn-outline btn-success">
                                            Acknowledge
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : <p>No anomalies detected. Good job!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
