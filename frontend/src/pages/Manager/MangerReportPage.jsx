import React, { useState, useEffect } from "react";
import axios from "axios";

const ManagerLeaveReport = () => {
  const [report, setReport] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(baseURL +"/leave/manager/report/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReport(response.data.report);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, []);

  return (
    <div>
      <h2>All Employees Leave Report</h2>
      {report.length ? (
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.map((leave, index) => (
              <tr key={index}>
                <td>{leave.employee}</td>
                <td>{leave.leave_type}</td>
                <td>{new Date(leave.date).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leave data available</p>
      )}
    </div>
  );
};

export default ManagerLeaveReport;
