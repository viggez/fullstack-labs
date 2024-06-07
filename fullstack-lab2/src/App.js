import React, { useEffect, useState } from 'react';
import ProjectAssignmentsTable from './components/ProjectAssignmentsTable';

function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <h1>Project Assignments</h1>
      <ProjectAssignmentsTable />
    </div>
  );
}

export default App;

