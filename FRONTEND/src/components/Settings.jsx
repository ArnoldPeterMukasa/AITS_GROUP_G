import React, { useState } from 'react';
import './Settings.css'; // Include CSS file for styling

function Settings() {
    const [userProfile, setUserProfile] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: false,
        smsAlerts: false,
        inAppAlerts: false,
    });

    // Handle user profile changes
    const handleProfileChange = (e) => {
        setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
    };

    // Handle notification settings changes
    const handleNotificationChange = (e) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const saveSettings = () => {
        alert('Settings Saved!');
        // Here we would normally send the data to the server or database.
        console.log({
            userProfile,
            notifications,
        });
    };

    return (
        <div className="settings">
            <h1>Settings</h1>

            {/* User Preferences */}
            <section className="user-preferences">
                <h2>User Preferences</h2>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={userProfile.username}
                        onChange={handleProfileChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={userProfile.email}
                        onChange={handleProfileChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={userProfile.password}
                        onChange={handleProfileChange}
                    />
                </label>
            </section>

            {/* Notification Settings */}
            <section className="notification-settings">
                <h2>Notification Settings</h2>
                <label>
                    <input
                        type="checkbox"
                        name="emailAlerts"
                        checked={notifications.emailAlerts}
                        onChange={handleNotificationChange}
                    />
                    Email Alerts
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="smsAlerts"
                        checked={notifications.smsAlerts}
                        onChange={handleNotificationChange}
                    />
                    SMS Alerts
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="inAppAlerts"
                        checked={notifications.inAppAlerts}
                        onChange={handleNotificationChange}
                    />
                    In-App Alerts
                </label>
            </section>

            {/* Save Button */}
            <button onClick={saveSettings}>Save Settings</button>
        </div>
    );
}

export default Settings;
