'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaBrain, FaFileAlt, FaCogs, FaBars, FaHome, FaHistory } from 'react-icons/fa';
import '../../styles/page.css';  
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { supabase } from '../../lib/supabase';

interface QueryResult {
  id: string;
  model: string;
  result: number;
  result_details: {
    scoreGptZero: number;
    scoreOpenAI: number;
    scoreWriter: number;
    scoreCrossPlag: number;
    scoreCopyLeaks: number;
    scoreSapling: number;
    scoreContentAtScale: number;
    scoreZeroGPT: number;
    human: number;
  };
  status: string;
  retry_count: number;
}

const DetectPage = () => {
  const [text, setText] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isQueryPending, setIsQueryPending] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [resultDetails, setResultDetails] = useState<QueryResult['result_details']>({
    scoreGptZero: 0,
    scoreOpenAI: 0,
    scoreWriter: 0,
    scoreCrossPlag: 0,
    scoreCopyLeaks: 0,
    scoreSapling: 0,
    scoreContentAtScale: 0,
    scoreZeroGPT: 0,
    human: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    setError(null);
    setIsQueryPending(true);
    setProgress(0);

    try {
      const detectionResponse = await axios.post('/api/detect', { text });
      const { id } = detectionResponse.data;

      simulateLoadingProgress();

      await pollQueryStatus(id);

      const { ai, human } = calculateHumanVsAI(result?.result || 0);

      const resultString = detectionResult(ai, human);

      const { data, error } = await supabase
        .from('historyD')
        .insert([
          {
            text: text,
            result: resultString,
            timestamp: new Date().toISOString(),
          },
        ]);

      if (error) {
        throw error;
      }

      console.log('Result saved successfully:', data);
    } catch (error) {
      console.error('Error during detection:', error);
      setError('Error during detection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateLoadingProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const pollQueryStatus = async (id: string) => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const queryResponse = await axios.post('/api/query', { id });

        if (queryResponse.data.status === 'done') {
          setResult(queryResponse.data);
          setIsQueryPending(false);
          setResultDetails(queryResponse.data.result_details);
          return;
        }

        attempts++;
        console.log(`Attempt ${attempts}: Status still ${queryResponse.data.status}, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error checking query status:', error);
        setError('Error checking status. Please try again.');
        setIsQueryPending(false);
        return;
      }
    }

    setError('Unable to retrieve result after multiple attempts.');
    setIsQueryPending(false);
  };

  const calculateHumanVsAI = (result: number) => {
    const ai = result;
    const human = 100 - result;
    return { ai, human };
  };

  const detectionResult = (ai: number, human: number) => {
    if (ai > 50) {
      return "AI Generated";
    } else if (human > 50) {
      return "Human Generated";
    } else {
      return "Undetermined";
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleHomeClick = () => {
    router.push('/detect');
  };

  const handleHistoryClick = () => {
      router.push('/detect/history');
  };
  const handleLogout = () => {
      Cookies.remove('supabaseToken');
      router.push('/detect/login');
  };

  const { human, ai } = result ? calculateHumanVsAI(result.result) : { human: 0, ai: 0 };

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

        <div className="card-container">
          <div className="input-card">
            <h1>Text AI Detector</h1>
            <p className="description">
              This tool allows you to check if the entered text was generated by artificial intelligence.
              Just paste or type your content and click "Generate Analysis" to get a result with the probability.
            </p>

            <div className="input-container">
              <textarea
                placeholder="Type the text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="textarea"
              />
              <div className="word-counter">
                <span>Words: <strong>{text.length}</strong> / 3000</span>
              </div>
            </div>

            <div className="generate-btn-container">
              <button className="generate-btn" onClick={handleDetect} disabled={loading || isQueryPending}>
                {loading ? 'Detecting...' : isQueryPending ? 'Querying...' : 'Generate Analysis'}
              </button>
            </div>
          </div>

          <div className="result-card">
            <div className="result-header">
              <FaRobot style={{ fontSize: '50px', color: '#007bff' }} />
              <h2>AI Check</h2>
            </div>

            <div className="result-body">
              <div className="percentage">
                <p><strong>AI Probability:</strong></p>
                <div className="progress-bar" style={{ backgroundColor: '#f8d7da' }}>
                  <div className="progress" style={{ width: `${ai}%`, backgroundColor: 'red' }}></div>
                </div>
                <p className="percent-text">{ai.toFixed(2)}%</p>
              </div>

              <div className="percentage">
                <p><strong>Human Probability:</strong></p>
                <div className="progress-bar" style={{ backgroundColor: '#d4edda' }}>
                  <div className="progress" style={{ width: `${human}%`, backgroundColor: 'green' }}></div>
                </div>
                <p className="percent-text">{human.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="model-details-container">
          {Object.entries(resultDetails).map(([key, value]) => (
            <div key={key} className="model-detail-card">
              <div className="card-header">
                {key === 'scoreCopyLeaks' && <FaFileAlt />}
                {key === 'scoreSapling' && <FaCogs />}
                {key === 'scoreWriter' && <FaBrain />}
                {key === 'scoreGptZero' && <FaRobot />}
                {key === 'scoreOpenAI' && <FaRobot />}
                {key === 'scoreCrossPlag' && <FaFileAlt />}
                {key === 'scoreContentAtScale' && <FaCogs />}
                {key === 'scoreZeroGPT' && <FaRobot />}
                {key === 'human' && <FaBrain />}
                <h5>{key}</h5>
              </div>
              <div className="card-body">
                <div className="score">
                  <div className="meter" style={{ width: `${progress}%` }}></div>
                </div>
                <div>{progress < 100 ? `${progress}%` : `${value}%`}</div>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error">{error}</div>}
      </main>
    </div>
  );
};

export default DetectPage;
