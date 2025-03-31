import React, { useState } from 'react';
import './Notifications.css'; // Include CSS file for styling
// Notification Types Enum
const NotificationTypes = {
    NEW_ISSUE: 'New Issue',
    ESCALATION: 'Escalation',
    RESOLVED: 'Resolved',
    SYSTEM_UPDATE: 'System Update'
    };

    function Notifications() {
    // Sample notifications with their types and read status
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'New issue reported!', type: NotificationTypes.NEW_ISSUE, isRead: false },
        { id: 2, message: 'Lecturer request pending', type: NotificationTypes.ESCALATION, isRead: false },
        { id: 3, message: 'Course material updated', type: NotificationTypes.SYSTEM_UPDATE, isRead: true }
    ]);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [inAppNotifications, setInAppNotifications] = useState(true);

    // Toggle the read status of a notification
    const toggleReadStatus = (id) => {
        setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, isRead: !notification.isRead } : notification
        ));
    };

    // Count unread notifications
    const unreadCount = notifications.filter(notification => !notification.isRead).length;

    // Toggle email notifications
    const toggleEmailNotifications = () => {
        setEmailNotifications(!emailNotifications);
    };

    // Toggle in-app notifications
    const toggleInAppNotifications = () => {
        setInAppNotifications(!inAppNotifications);
    };

    return (
        <div className="notifications">
        <h1>Notifications</h1>
        
        {/* Unread notifications count */}
        <div>
            <strong>Unread Notifications: {unreadCount}</strong>
        </div>
        
        {/* Notification list */}
        <ul>
            {notifications.map(notification => (
            <li
                key={notification.id}
                className={notification.isRead ? 'read' : 'unread'}
                onClick={() => toggleReadStatus(notification.id)}
                style={{ cursor: 'pointer' }}
            >
                <span className={`notification-type ${notification.type.replace(" ", "-")}`}>
                [{notification.type}]
                </span>
                {notification.message}
            </li>
            ))}
        </ul>

        {/* Notification preferences */}
        <div className="preferences">
            <h3>Notification Preferences</h3>
            <label>
            <input
                type="checkbox"
                checked={emailNotifications}
                onChange={toggleEmailNotifications}
            />
            Enable Email Notifications
            </label><br />
            <label>
            <input
                type="checkbox"
                checked={inAppNotifications}
                onChange={toggleInAppNotifications}
            />
            Enable In-App Notifications
            </label>
        </div>
        </div>
    );
}

export default Notifications;
