import React, { useEffect, useState } from 'react';
import '../styles.css';

const ProjectAssignmentsTable = () => {
  const [assignments, setAssignments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'start_date', direction: 'ascending' });

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/project_assignments');
      const data = await response.json();
      setAssignments(data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    const interval = setInterval(() => {
      fetchAssignments();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssignments = React.useMemo(() => {
    let sortableAssignments = [...assignments];
    if (sortConfig !== null) {
      sortableAssignments.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAssignments;
  }, [assignments, sortConfig]);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => requestSort('employee_id')}>Employee_ID</th>
          <th onClick={() => requestSort('employee.full_name')}>Employee_name</th>
          <th onClick={() => requestSort('project.project_name')}>Project_name</th>
          <th onClick={() => requestSort('start_date')}>Start_date</th>
        </tr>
      </thead>
      <tbody>
        {sortedAssignments.map((assignment) => (
          <tr key={assignment._id}>
            <td>{assignment.employee_id}</td>
            <td>{assignment.employee.full_name}</td>
            <td>{assignment.project.project_name}</td>
            <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectAssignmentsTable;
