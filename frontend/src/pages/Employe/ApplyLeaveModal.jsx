

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "sonner";

const ApplyLeaveModal = ({ closeModal }) => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState({
    leave_type: '',
    date: '',
    reason: ''
  });

  const handleInputChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const submitLeaveRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    console.log("the token is -----------", token);
    
    try {
      const response = await axios.post(baseURL + "/leave/apply/", leaveData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("thelll rethecode=====",response.status);
      
      if (response.status === 201) {
        console.log("is this work================");
        toast.success("Leave request submitted successfully!");
        console.log("Closing modal");

        closeModal(); // Close modal after successful submission
        navigate('/dashboard');

      }
    } catch (error) {
      toast.error("Failed to submit leave request.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3 relative">
        {/* Close button (X) */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
         &times;
        </button>
        
        <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
        <form onSubmit={submitLeaveRequest} className="space-y-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              id="leave_type"
              name="leave_type"
              value={leaveData.leave_type}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            >
              <option value="">Select Leave Type</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={leaveData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={leaveData.reason}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm"
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700">
            Submit Leave Request
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="w-full py-2 px-4 mt-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
