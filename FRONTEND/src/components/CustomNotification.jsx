// src/components/CustomNotification.jsx
import { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { FaCheck, FaTimes, FaExclamation } from "react-icons/fa";
import "./CustomNotification.css";

export default function CustomNotification() {
  const { notification, progress, dismissNotification } = useContext(NotificationContext);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <FaCheck className="notification-icon" />;
      case "error":
        return <FaTimes className="notification-icon" />;
      default:
        return <FaExclamation className="notification-icon" />;
    }
  };

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        {getIcon()}
        <span>{notification.message}</span>
      </div>
      <div 
        className="progress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}