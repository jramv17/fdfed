import { useEffect, useState } from 'react';

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch('/api/complaints')
      .then((response) => response.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error('Error fetching complaints:', error));
  }, []);

  return (
    <div>
      <h1>Complaints</h1>
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint.id}>
            <h2>{complaint.complaint_title}</h2>
            <p>Type: {complaint.complaint_type}</p>
            <p>Details: {complaint.complaint_detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComplaintList;
