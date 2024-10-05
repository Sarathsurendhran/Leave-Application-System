import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ManagerLeaveHistory from "./LeaveHistory";
import { useNavigate } from "react-router-dom";
import LeaveRequests from "./LeaveRequests";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isRequestedLeavesModalOpen, setIsRequestedLeavesModalOpen] = useState(false);
  const [isLeaveHistoryModalOpen, setIsLeaveHistoryModalOpen] = useState(false);
  // const firstName = useSelector((state) => state.auth.first_name);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const [requestedLeaves, setRequestedLeaves] = useState([]);

  const openRequestedLeavesModal = () => {
      setIsRequestedLeavesModalOpen(true);
  };

  const closeRequestedLeavesModal = () => {
      setIsRequestedLeavesModalOpen(false);
  };

  const openLeaveHistoryModal = () => {
      setIsLeaveHistoryModalOpen(true);
  };

  const closeLeaveHistoryModal = () => {
      setIsLeaveHistoryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-white text-lg">Welcome</h1>
          <button className="bg-red-500 px-4 py-2 rounded text-white" onClick={() => {}}>
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-row mt-6 justify-between">
        {/* Left Side - Buttons */}
        <div className="flex flex-col w-1/2 space-y-4 p-6">
          <button
            onClick={openRequestedLeavesModal}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Requested Leaves
          </button>
          <button
            onClick={openLeaveHistoryModal}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Leave History
          </button>
          <button
  onClick={() => navigate("/manreport")} // Navigate to the reports page
  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
>
  Generate Report
</button>
        </div>

        {/* Right Side - Calendar */}
        <div className="w-1/2 bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Leave Calendar</h2>
          <Calendar
            tileClassName={({ date }) => {
              const leaveDates = calendarLeaves.map(leave => new Date(leave.date).toDateString());
              return leaveDates.includes(date.toDateString()) ? "bg-red-200" : null;
            }}
            className="w-full"
          />
        </div>
      </div>
      

      {/* Apply Leave Modal */}
      {isRequestedLeavesModalOpen && <LeaveRequests closeModal={closeRequestedLeavesModal} />}

      {/* History Modal */}
      {isLeaveHistoryModalOpen && <ManagerLeaveHistory closeModal={closeLeaveHistoryModal} />}
    </div>
  );
};

export default Dashboard;