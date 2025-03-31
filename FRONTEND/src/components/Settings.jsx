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

    const [systemConfig, setSystemConfig] = useState({
        academicCalendar: '',
        issueCategories: '',
        escalationRules: '',
    });

    const [security, setSecurity] = useState({
        twoFactorAuth: false,
        dataStorage: 'Cloud',
    });

    const [accessControl, setAccessControl] = useState({
        role: 'Registrar',
    });

    // Handle user profile changes
    const handleProfileChange = (e) => {
        setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
    };

    // Handle notification settings changes
    const handleNotificationChange = (e) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    // Handle system configuration changes
    const handleSystemConfigChange = (e) => {
        setSystemConfig({ ...systemConfig, [e.target.name]: e.target.value });
    };

    // Handle security settings changes
    const handleSecurityChange = (e) => {
        setSecurity({ ...security, [e.target.name]: e.target.value });
    };

    const handleTwoFactorChange = (e) => {
        setSecurity({ ...security, twoFactorAuth: e.target.checked });
    };

    // Handle access control changes
    const handleAccessControlChange = (e) => {
        setAccessControl({ ...accessControl, role: e.target.value });
    };

    const saveSettings = () => {
        alert('Settings Saved!');
        // Here we would normally send the data to the server or database.
        console.log({
        userProfile,
        notifications,
        systemConfig,
        security,
        accessControl,
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

        {/* System Configuration */}
        <section className="system-configuration">
            <h2>System Configuration</h2>
            <label>
            Academic Calendar:
            <input
                type="text"
                name="academicCalendar"
                value={systemConfig.academicCalendar}
                onChange={handleSystemConfigChange}
            />
            </label>
            <label>
            Issue Categories:
            <input
                type="text"
                name="issueCategories"
                value={systemConfig.issueCategories}
                onChange={handleSystemConfigChange}
            />
            </label>
            <label>
            Escalation Rules:
            <input
                type="text"
                name="escalationRules"
                value={systemConfig.escalationRules}
                onChange={handleSystemConfigChange}
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

        {/* Data Backup & Security */}
        <section className="data-backup-security">
            <h2>Data Backup & Security</h2>
            <label>
            Data Storage:
            <select
                name="dataStorage"
                value={security.dataStorage}
                onChange={handleSecurityChange}
            >
                <option value="Cloud">Cloud</option>
                <option value="Local">Local</option>
            </select>
            </label>
            <label>
            <input
                type="checkbox"
                name="twoFactorAuth"
                checked={security.twoFactorAuth}
                onChange={handleTwoFactorChange}
            />
            Enable Two-Factor Authentication
            </label>
        </section>

        {/* Access Control */}
        <section className="access-control">
            <h2>Access Control</h2>
            <label>
            User Role:
            <select
                name="role"
                value={accessControl.role}
                onChange={handleAccessControlChange}
            >
                <option value="Registrar">Registrar</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
            </select>
            </label>
        </section>

        {/* Save Button */}
        <button onClick={saveSettings}>Save Settings</button>
        </div>
    );
}

export default Settings;
