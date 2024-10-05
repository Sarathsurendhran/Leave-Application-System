import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ApplyLeaveModal from "./ApplyLeaveModal";
import axios from "axios";
import LeaveHistory from "./HistoryModal";
import { useSelector } from "react-redux";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import DownloadLeaveReport from "./DownloadLeaveReport";


const Dashboard = () => {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const firstName = useSelector((state) => state.auth.first_name);
  const [calendarLeaves, setCalendarLeaves] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL
  const handleLogout = () => {
    // Clear tokens from local storage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("tokens");

    
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

  
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem('access'); 
        const response = await axios.get(baseURL + '/leave/history/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCalendarLeaves(response.data);  
      } catch (error) {
        console.error('Error fetching leave history:', error);
      }
    };

    fetchLeaveHistory();
  }, []);



  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white font-bold text-2xl">
            Leave Application System
          </h1>

          <div className="flex items-center space-x-4 ml-auto">
            <h1 className="text-white text-lg">Welcome, {firstName}</h1>
            <button
              className="bg-red-500 px-4 py-2 rounded text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
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

          <DownloadLeaveReport/>
         
        </div>

        {/* Right Side - Calendar */}
        <div className="w-1/2 bg-white p-6 shadow-md rounded-md">
          <h2 className="text-xl font-bold mb-4">Leave Calendar</h2>
          <Calendar
            tileClassName={({ date }) => {
              const leaveDates = calendarLeaves.map((leave) =>
                new Date(leave.date).toDateString()
              );
              return leaveDates.includes(date.toDateString())
                ? "bg-red-200"
                : null;
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

            <LeaveHistory />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
