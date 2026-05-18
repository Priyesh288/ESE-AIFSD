import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Sparkles, BrainCircuit, TrendingUp, AlertTriangle } from 'lucide-react';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const employeesRes = await api.get('/employees');
        const employees = employeesRes.data;
        
        if (employees.length === 0) {
          setLoading(false);
          return;
        }

        const aiRes = await api.post('/ai/recommend', { employees });
        setRecommendations(aiRes.data.recommendations);
        setIsMock(aiRes.data.isMock);
      } catch (err) {
        setError('Failed to load AI recommendations. Please check API keys.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '10vh' }}>
      <div className="loader" style={{ margin: 'auto', marginBottom: '1rem' }}></div>
      <p style={{ color: 'var(--text-muted)' }}>Analyzing employee data with AI...</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
      <AlertTriangle size={48} style={{ margin: 'auto', marginBottom: '1rem' }} />
      <h2>{error}</h2>
    </div>
  );

  if (recommendations.length === 0) return (
    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      <BrainCircuit size={48} style={{ margin: 'auto', marginBottom: '1rem', opacity: 0.5 }} />
      <p>No employees found to analyze. Add some in the dashboard first.</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Insights & Recommendations
        </h1>
        <Sparkles color="#a855f7" />
      </div>

      {isMock && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} /> 
          Using fallback rules engine. Set OPENROUTER_API_KEY in the backend to enable actual AI analysis.
        </div>
      )}

      <div className="grid">
        {recommendations.map((rec, index) => (
          <div key={index} className="card glass-panel" style={{ borderTop: index === 0 ? '4px solid #f59e0b' : '1px solid var(--border-color)' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {index === 0 && <span style={{ color: '#f59e0b' }}>🏆</span>}
                {rec.name}
              </h3>
              <div className="badge" style={{ background: rec.score >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: rec.score >= 80 ? '#10b981' : '#ef4444' }}>
                Score: {rec.score}
              </div>
            </div>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Promotion Recommendation</div>
              <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', color: rec.promotionSuggestion.includes('High') || rec.promotionSuggestion.includes('Promotion') ? '#10b981' : 'var(--text-main)' }}>
                <TrendingUp size={16} /> {rec.promotionSuggestion}
              </div>
            </div>

            <div style={{ margin: '1rem 0' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>AI Feedback</div>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>"{rec.feedback}"</p>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Suggested Training</div>
              <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
                {rec.trainingSuggestions?.map((training, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{training}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
