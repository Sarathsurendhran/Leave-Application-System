import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DownloadLeaveReport = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem("access");
        const response = await axios.get(baseURL + "/leave/history/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaveHistory(response.data);
      } catch (error) {
        console.error("Error fetching leave history:", error);
      }
    };

    fetchLeaveHistory();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.text("Leave Report", 14, 20);

    // Check if there is data to display
    if (leaveHistory.length > 0) {
      // Define table headers
      const headers = [
        ["Leave Type", "Start Date", "End Date", "Reason", "Status", "Submission Date"],
      ];

      // Define table rows
      const data = leaveHistory.map((leave) => [
        leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1), // Capitalize Leave Type
        new Date(leave.start_date).toLocaleDateString(),                     // Start Date
        new Date(leave.end_date).toLocaleDateString(),                       // End Date
        leave.reason,                                                         // Reason
        leave.status.charAt(0).toUpperCase() + leave.status.slice(1),       // Capitalize Status
        new Date(leave.submission_date).toLocaleString(),                    // Submission Date
      ]);

      // Add table to PDF using autoTable
      doc.autoTable({
        head: headers,
        body: data,
        startY: 30, // Start after the title
      });

      // Save the PDF
      doc.save("leave-report.pdf");
    } else {
      // If no leave history found, show a message in the PDF
      doc.text("No leave history available.", 14, 30);
      doc.save("leave-report.pdf");
    }
  };

  return (
    <div>
      <button
        onClick={downloadPDF}
        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Download Leave Report
      </button>
    </div>
  );
};

export default DownloadLeaveReport;
