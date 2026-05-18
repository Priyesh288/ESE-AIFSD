import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import { Search, Plus } from 'lucide-react';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async (department = '') => {
    setLoading(true);
    try {
      const url = department ? `/employees/search?department=${department}` : '/employees';
      const response = await api.get(url);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(searchTerm);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        setEmployees(employees.filter(emp => emp._id !== id));
      } catch (error) {
        console.error('Error deleting employee', error);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Employee Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      {showForm && (
        <EmployeeForm 
          onClose={() => setShowForm(false)} 
          onEmployeeAdded={(newEmp) => setEmployees([...employees, newEmp])} 
        />
      )}

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by Department (e.g. Engineering)"
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
          {searchTerm && (
            <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); fetchEmployees(''); }}>
              Clear
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="loader" style={{ margin: 'auto' }}></div>
      ) : (
        <EmployeeList employees={employees} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Dashboard;
