import React from "react";
import { Tooltip } from "@mui/material";

const CompanyCard = ({
  company,
  isSelected,
  highlightDisabled,
  notifications = {},
  lastFiveDates = [],
  activeSchedules = {},
  onToggleSelection,
  onToggleHighlight,
  onScheduleNext,
  onLogCommunication,
  onCancelNext,
}) => {
  const overdue =
    notifications.overdue?.some((comp) => comp._id === company.id) || false;
  const dueToday =
    notifications.dueToday?.some((comp) => comp._id === company.id) || false;

  const highlightClass =
    !highlightDisabled[company.id] && overdue
      ? "bg-red-50 border-l-4 border-red-500"
      : !highlightDisabled[company.id] && dueToday
      ? "bg-yellow-50 border-l-4 border-yellow-500"
      : "bg-white";

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/"); // Split the string by "/"
    const formattedDate = new Date(`${month}/${day}/${year}`); // Reorder to "MM/DD/YYYY"

    if (isNaN(formattedDate.getTime())) {
      return "Invalid Date"; // Return fallback if date is invalid
    }
    return formattedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Modify this part to show all scheduled communications
  const scheduledCommunications = company.scheduledCommunications || [];

  return (
    <div
      className={`p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl ${highlightClass}`}
      style={{ overflow: "hidden" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Company Info Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {company.name}
              </h3>
            </div>
            <button
              className="text-xs px-2 py-1 rounded-lg text-white hover:bg-blue-700 transition-colors"
              style={{ backgroundColor: '#1C4E80' }} // Custom background color
              onClick={(e) => {
                e.stopPropagation(); // Prevents event bubbling
                onLogCommunication(company.id); // Calls the parent's function
              }}
            >
              Click To Communicate
            </button>
          </div>

          <div className="flex flex-col gap-1 text-xs text-gray-600">
            {company.location && (
              <div className="flex items-center gap-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{company.location}</span>
              </div>
            )}
            {company.linkedIn && (
              <a
                href={company.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>
        </div>

        {/* Recent Communications Section */}
        <div className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Recent Communications
          </h4>
          <ul className="space-y-2">
            {lastFiveDates.length > 0 ? (
              lastFiveDates.map((communication) => (
                <Tooltip
                  key={communication._id}
                  title={communication.notes || "No description"}
                  placement="top"
                  arrow
                >
                  <li
                    className="text-xs bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
                  >
                    {/* Method */}
                    <span className="font-medium text-gray-700 flex-shrink-0">
                      {communication.method}
                    </span>

                    {/* Date */}
                    <span className="font-medium text-gray-700">
                      {formatDate(communication.communicationDate)}
                    </span>
                  </li>
                </Tooltip>
              ))
            ) : (
              <li className="text-xs text-gray-500 italic text-center py-2 bg-white rounded-lg">
                No communication history available
              </li>
            )}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Next Scheduled Contact
            {/* Move the Schedule button here */}
            <button
              className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors ml-4"
              style={{ backgroundColor: '#1C4E80' }}
              onClick={(e) => {
                e.stopPropagation();
                onScheduleNext(company.id);
              }}
            >
              Schedule
            </button>
          </h4>

          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {/* Iterate over all scheduled communications */}
                {scheduledCommunications.length > 0 ? (
                  scheduledCommunications.map((scheduled) => (
                    <div
                      key={scheduled.id}
                      className="flex items-center justify-between space-x-4 text-xs"
                    >
                      {/* Scheduled name */}
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full font-medium flex-shrink-0 w-1/4 text-center">
                        {scheduled.name}
                      </span>

                      {/* Scheduled date */}
                      <span
                        style={{ marginRight: "20px" }}
                        className="font-medium text-gray-700 flex-shrink-0 w-1/3 text-center"
                      >
                        {new Date(scheduled.date).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>

                      {/* Cancel button */}
                      <button
                        className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-600 hover:text-white transition-colors flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancelNext(company.id, scheduled.id);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 italic">
                    No scheduled communication
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
