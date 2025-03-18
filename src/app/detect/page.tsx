'use client';

import { useState, useEffect } from 'react';
import { detectAIText, queryDetectionResult } from '../../lib/ai';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Importando ícones
import "@/styles/page.css";  // Importação do CSS
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { supabase } from '@/lib/supabase';

export default function DetectPage() {
    const [text, setText] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null); // Progresso da detecção
    const router = useRouter();

    useEffect(() => {
        const checkUserSession = async () => {
            const token = Cookies.get('supabaseToken');

            if (token) {
                // Atualizado para usar o método getSession
                const { data: session, error } = await supabase.auth.getSession();

                if (error || !session || !session.session?.user) {
                    // Se o token for inválido ou o usuário não for encontrado, redireciona para o login
                    router.push('/detect/login');
                }
            } else {
                // Se o token não estiver presente, redireciona para o login
                router.push('/detect/login');
            }
        };

        checkUserSession();
    }, [router]);
    const handleDetect = async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setProgress(0);
    
        try {
            // Envia o texto para detecção
            const detectionResponse = await detectAIText(text);
            const detectionId = detectionResponse.id;
    
            // Função para consultar o resultado
            const queryDetectionResultWithProgress = async (detectionId: string) => {
                let attempt = 0;
                const maxAttempts = 5;
                let queryResponse;
    
                // Espera até que o resultado esteja "done" ou atingido o limite de tentativas
                while (attempt < maxAttempts) {
                    queryResponse = await queryDetectionResult(detectionId);
                    if (queryResponse.status === 'done') {
                        return queryResponse;
                    }
    
                    // Atualiza o progresso
                    setProgress(((attempt + 1) * 20)); // Aumenta o progresso a cada loop
    
                    // Aguarda 1 segundo antes de tentar novamente
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    attempt += 1;
                }
    
                // Caso o limite de tentativas seja alcançado sem sucesso
                throw new Error('Detection failed after maximum attempts.');
            };
    
            // Chama a função de consulta
            const result = await queryDetectionResultWithProgress(detectionId);
    
            // Se o resultado for encontrado, atualiza o estado
            setResult(result);
    
        } catch (error) {
            console.error('Error detecting AI text:', error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleLogout = () => {
        // Remove o token do cookie
        Cookies.remove('supabaseToken');
        // Redireciona para o login
        router.push('/detect/login');
    };

    return (
        <div className="container">
            <header className="header">
                <img src="/detect/login/undetectable_ai_cover.png" alt="Undetectable AI Logo" className="header-logo" />
                <button className="logout-button" onClick={handleLogout}>Sair</button>
            </header>

            <div className="main-content">
                <aside className="sidebar">
                    <nav>
                        <ul>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">Detection History</a></li>
                            <li><a href="#">Settings</a></li>
                        </ul>
                    </nav>
                </aside>
                <section className="content">
                    <h1>AI Text Detection</h1>
                    <div className="form-container">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text to detect AI..."
                            rows={10}
                            className="text-area"
                        />
                        <button onClick={handleDetect} disabled={loading} className="detect-button">
                            {loading ? <FaSpinner className="spinner" /> : 'Detect AI'}
                        </button>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    {progress && !result && (
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                            <p>{progress}%</p>
                        </div>
                    )}

                    {result && result.status === 'done' && (
                        <div className="result-container">
                            <h2>Detection Result</h2>
                            <p><strong>Status:</strong> {result.status}</p>
                            <p><strong>Result:</strong> {result.result === 'true' ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />} AI detected</p>
                            <p><strong>Details:</strong></p>
                            <pre>{JSON.stringify(result.result_details, null, 2)}</pre>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
