import React from 'react';
import { Trash2, Briefcase, Award } from 'lucide-react';

const EmployeeList = ({ employees, onDelete }) => {
  if (employees.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>No employees found. Add some to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {employees.map((emp) => (
        <div key={emp._id} className="card glass-panel animate-fade-in">
          <div className="card-header">
            <div>
              <h3 className="card-title">{emp.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{emp.email}</p>
            </div>
            <button 
              onClick={() => onDelete(emp._id)}
              className="btn btn-danger" 
              style={{ padding: '0.4rem', borderRadius: '50%' }}
              title="Delete Employee"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <Briefcase size={14} color="var(--primary-color)" /> {emp.department}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
              <Award size={14} color="#10b981" /> Score: {emp.performanceScore}/100
            </span>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Skills:</div>
            <div>
              {emp.skills.map((skill, index) => (
                <span key={index} className="badge-skill">{skill}</span>
              ))}
            </div>
          </div>
          
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.875rem' }}>
            Experience: {emp.experience} years
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;
