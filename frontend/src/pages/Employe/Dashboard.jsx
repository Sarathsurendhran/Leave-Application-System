
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ApplyLeaveModal from "./ApplyLeaveModal";
// import HistoryModal from "./HistoryModal";
import LeaveHistory from "./HistoryModal";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const firstName = useSelector((state) => state.auth.first_name);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const handleLogout = () => {
    // Clear tokens from local storage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("tokens")

    // Redirect to login page
    navigate("/login");
  };


  const openApplyModal = () => {
    setIsApplyModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsApplyModalOpen(false);
  };

  const openHistoryModal = () => {
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-white text-lg">Welcome, {firstName}</h1>
          <button className="bg-red-500 px-4 py-2 rounded text-white"  onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-row mt-6 justify-between">
        {/* Left Side - Buttons */}
        <div className="flex flex-col w-1/2 space-y-4 p-6">
          <button
            onClick={openApplyModal}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Apply for Leave
          </button>
          <button
            onClick={openHistoryModal}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Leave History
          </button>
          <button
  onClick={() => navigate("/empreport")} // Navigate to the reports page
  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
>
  Download Leave Report
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
      {isApplyModalOpen && <ApplyLeaveModal closeModal={closeApplyModal} />}

      {/* History Modal */}
      {/* {isHistoryModalOpen && <LeaveHistory closeModal={closeHistoryModal} />} */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl relative">
            {/* Close Button */}
            <button
              onClick={closeHistoryModal}
              className="absolute top-2 right-2 text-xl font-bold"
            >
              &times;
            </button>

            {/* Render LeaveHistory directly in the modal */}
            <LeaveHistory />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
