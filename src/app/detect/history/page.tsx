'use client';
import { useState, useEffect } from 'react';
import { FaBars, FaHome, FaHistory } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase'; 
import Cookies from 'js-cookie';
import "@/styles/history.css";

interface HistoryItem {
    id: number;
    text: string;
    result: string;
    timestamp: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const router = useRouter();

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleHomeClick = () => {
        router.push('/detect');
    };

    const handleHistoryClick = () => {
        router.push('/detect/history');
    };

    const handleSettingsClick = () => {
        router.push('/detect/settings');
    };

    const handleLogout = () => {
        Cookies.remove('supabaseToken');
        router.push('/detect/login');
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const fetchHistory = async () => {
            try {
                const { data, error } = await supabase
                    .from('historyD')
                    .select('id, text, result, timestamp')
                    .order('timestamp', { ascending: false });

                if (error) {
                    setError('Failed to fetch history.');
                    setLoading(false);
                    return;
                }

                setHistory(data || []);
            } catch {
                setError('Unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isMounted]);

    const formatDetails = (details: string) => {
        try {
            const parsed = JSON.parse(details);
            return `Status: ${parsed.status}, Message: ${parsed.message}`;
        } catch {
            return details;
        }
    };

    if (loading) {
        return <p>Loading history...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container">
            <header className="header">
                <img src="/detect/login/undetectable_ai_cover.png" alt="Undetectable AI Logo" className="header-logo" />
                <button
                    className={`hamburger ${sidebarOpen ? 'active' : ''}`}
                    onClick={toggleSidebar}
                >
                    <FaBars />
                </button>
            </header>

            <main className={`main-content ${!sidebarOpen ? 'expanded' : ''}`}>
                <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <nav>
                        <ul>
                            <li><a href="#" onClick={handleHomeClick}><FaHome /> Home</a></li>
                            <li><a href="#" onClick={handleHistoryClick}><FaHistory /> Detection History</a></li>
                        </ul>
                        <button className="logout-button" onClick={handleLogout}>Logout</button>
                    </nav>
                </aside>

                <div className="main-content-area">
                    <h1>Detection History</h1>
                    {history.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Text</th>
                                    <th>Result</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.text}</td>
                                        <td>{item.result}</td>
                                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No history found.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
