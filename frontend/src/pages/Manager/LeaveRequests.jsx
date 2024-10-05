import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveRequests = ({ closeModal }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Fetch leave requests from the database
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("access"); // Assuming the token is stored in localStorage
        const response = await axios.get(baseURL+"/leave/requests/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data); // Log the data to see its structure
        setLeaveRequests(response.data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setLeaveRequests([]); // Fallback to an empty array in case of error
      }
    };

    fetchLeaveRequests();
  }, []);



    const handleApprove = async (id) => {
        try {
        const token = localStorage.getItem("access");
        const response = await axios.patch(baseURL+`/leave/requests/${id}/approve/`, {}, {
            headers: {
            Authorization: `Bearer ${token}`, // Include token in the request
            },
        });
        console.log("Approval successful:", response.data);
        setLeaveRequests((prev) => prev.filter((request) => request.id !== id)); // Remove approved request from the list
        } catch (error) {
        console.error("Error approving leave request:", error);
        }
    };

  // Handle declining a leave request
  const handleDecline = async (id) => {
    try {
      const token = localStorage.getItem("access");
      await axios.patch(baseURL+`/leave/requests/${id}/decline/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request
        },
      });
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id)); // Remove declined request from the list
    } catch (error) {
      console.error("Error declining leave request:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Requested Leaves</h2>

        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border border-gray-200 text-left">Employee Name</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Leave Type</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Date</th>
                <th className="px-4 py-2 border border-gray-200 text-left">Reason</th>
                <th className="px-4 py-2 border border-gray-200 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(leaveRequests) && leaveRequests.length > 0 ? (
                leaveRequests.map((request) => (
                  <tr key={request.id} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">
                    {request.employee_name}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1)}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      {request.reason}
                    </td>
                    <td className="px-4 py-3 border border-gray-200 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;
