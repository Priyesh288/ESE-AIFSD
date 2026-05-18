import React, { useState } from 'react';
import api from '../utils/api';
import { PlusCircle, X } from 'lucide-react';

const EmployeeForm = ({ onEmployeeAdded, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performanceScore: Number(formData.performanceScore),
        experience: Number(formData.experience)
      };
      
      const response = await api.post('/employees', payload);
      onEmployeeAdded(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', position: 'relative', marginBottom: '2rem' }}>
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
      >
        <X size={24} />
      </button>
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Employee</h3>
      
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <select name="department" className="form-input" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Skills (comma separated)</label>
            <input name="skills" type="text" className="form-input" placeholder="React, Node.js, MongoDB" value={formData.skills} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Performance Score (0-100)</label>
            <input name="performanceScore" type="number" min="0" max="100" className="form-input" value={formData.performanceScore} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Years of Experience</label>
            <input name="experience" type="number" min="0" className="form-input" value={formData.experience} onChange={handleChange} required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Adding...' : <><PlusCircle size={18} /> Add Employee</>}
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
