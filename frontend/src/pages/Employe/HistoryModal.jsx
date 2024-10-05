import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveHistory = ({closeModal}) => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem('access');  // Get token from local storage
        const response = await axios.get(baseURL + '/leave/history/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaveHistory(response.data);  // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching leave history:', error);
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Leave Request History</h2>
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="px-4 py-2 border border-gray-200">Employee Name</th> */}
              <th className="px-4 py-2 border border-gray-200">Leave Type</th>
              <th className="px-4 py-2 border border-gray-200">Date</th>
              <th className="px-4 py-2 border border-gray-200">Reason</th>
              <th className="px-4 py-2 border border-gray-200">Status</th>
              <th className="px-4 py-2 border border-gray-200">Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length > 0 ? (
              leaveHistory.map((leave) => (
                <tr key={leave.id} className="bg-white hover:bg-gray-50">
                  {/* <td className="px-4 py-3 border border-gray-200">
                    {leave.employee.first_name}
                  </td> */}
                  <td className="px-4 py-3 border border-gray-200">
                    {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {new Date(leave.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {leave.reason}
                  </td>
                  <td className={`px-4 py-3 border border-gray-200 ${leave.status === 'approved' ? 'text-green-500' : leave.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {new Date(leave.submission_date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                  No leave history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistory;
