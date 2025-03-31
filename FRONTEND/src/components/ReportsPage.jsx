import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2'; // For graphical visualization
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver'; // For exporting reports
import './ReportsPage.css'; // Import the CSS file

// Registering necessary chart components
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// Example data for graphs and reports
const exampleData = {
    issueResolution: [45, 30, 25],
    queryTrends: [70, 20, 10],
};

function ReportsPage() {
    const [selectedCategory, setSelectedCategory] = useState('issueResolution');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [department, setDepartment] = useState('');
    const [scheduleFrequency, setScheduleFrequency] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleMessage, setScheduleMessage] = useState('');

    const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
    const handleDateChange = (e) => setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    const handleDepartmentChange = (e) => setDepartment(e.target.value);

    const handleExport = (type) => {
        const reportData = generateReportData();
        let blob;
        
        if (type === 'csv') {
            blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
        } else if (type === 'excel') {
            blob = new Blob([reportData], { type: 'application/vnd.ms-excel' });
        } else if (type === 'pdf') {
            // Here you'd implement PDF generation logic
            blob = new Blob([reportData], { type: 'application/pdf' });
        }

        saveAs(blob, `report.${type}`);
    };

    const generateReportData = () => {
        return `Report Data\nCategory: ${selectedCategory}\nDate Range: ${dateRange.startDate} - ${dateRange.endDate}\nDepartment: ${department}`;
    };

    const getGraphData = () => {
        const data = selectedCategory === 'issueResolution' ? exampleData.issueResolution : exampleData.queryTrends;
        return {
            labels: ['Resolved', 'Pending', 'Unresolved'],
            datasets: [
                {
                    label: 'Issue Trends',
                    data,
                    backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
                    hoverBackgroundColor: ['#388E3C', '#F57C00', '#D32F2F'],
                },
            ],
        };
    };

    const handleScheduleChange = (e) => setScheduleFrequency(e.target.value);

    const handleScheduleSubmit = () => {
        if (!scheduleFrequency) {
            return;
        }

        setIsScheduling(true);
        setScheduleMessage(`Scheduling report to run ${scheduleFrequency}...`);

        // Simulate scheduling action (You can replace this with actual scheduling logic)
        setTimeout(() => {
            setIsScheduling(false);
            setScheduleMessage(`Report successfully scheduled for ${scheduleFrequency}.`);
        }, 2000);
    };

    return (
        <div className="reports-container">
            <h1>Reports</h1>
            <p>Generate and view reports for academic issue tracking.</p>
            
            {/* Report Category Selection */}
            <div>
                <label>Select Report Category: </label>
                <select onChange={handleCategoryChange} value={selectedCategory}>
                    <option value="issueResolution">Issue Resolution</option>
                    <option value="queryTrends">Query Trends</option>
                </select>
            </div>

            {/* Date Range Selection */}
            <div>
                <label>Start Date: </label>
                <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} />
                <label>End Date: </label>
                <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
            </div>

            {/* Department Selection */}
            <div>
                <label>Select Department: </label>
                <input
                    type="text"
                    placeholder="Enter department"
                    value={department}
                    onChange={handleDepartmentChange}
                />
            </div>

            {/* Graphical Visualization */}
            <div className="chart-container">
                <h3>{selectedCategory === 'issueResolution' ? 'Issue Resolution Report' : 'Query Trend Report'}</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <Pie data={getGraphData()} />
                </div>
            </div>

            {/* Export Options */}
            <div className="export-options">
                <h3>Export Options</h3>
                <button onClick={() => handleExport('csv')}>Export as CSV</button>
                <button onClick={() => handleExport('excel')}>Export as Excel</button>
                <button onClick={() => handleExport('pdf')}>Export as PDF</button>
            </div>

            {/* Automated Report Scheduling */}
            <div className="schedule-container">
                <h3>Automated Report Scheduling</h3>
                <label>Schedule Frequency: </label>
                <select onChange={handleScheduleChange} value={scheduleFrequency}>
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>
                <button onClick={handleScheduleSubmit} disabled={isScheduling || !scheduleFrequency}>
                    {isScheduling ? 'Setting Schedule...' : 'Set Schedule'}
                </button>
                {scheduleMessage && <p className="schedule-status">{scheduleMessage}</p>}
            </div>
        </div>
    );
}

export default ReportsPage;
