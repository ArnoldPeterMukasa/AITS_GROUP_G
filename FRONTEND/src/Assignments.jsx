import React, { useState } from 'react';
import './Assignments.css'; // Import CSS for styling

function Assignments() {
    const [assignment, setAssignment] = useState({
        title: '',
        description: '',
        file: null,
        type: 'Assignment', // Default type
        dueDate: '',
        dueTime: '',
    });
    const [marks, setMarks] = useState([]);
    const [uploadedAssignments, setUploadedAssignments] = useState([]);
    const [studentMarks, setStudentMarks] = useState([]);
    const [notification, setNotification] = useState('');

    // Handle assignment input changes
    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignment({ ...assignment, [name]: value });
    };

    // Handle file upload
    const handleFileChange = (e) => {
        setAssignment({ ...assignment, file: e.target.files[0] });
    };

    // Handle upload of the assignment
    const handleUploadAssignment = () => {
        const newAssignment = {
            ...assignment,
            uploadDate: new Date().toLocaleString(),
            link: `${window.location.origin}/assignments/${assignment.title.replace(/\s+/g, '-').toLowerCase()}`,
        };

        setUploadedAssignments([...uploadedAssignments, newAssignment]);

        // Clear assignment fields after upload
        setAssignment({
            title: '',
            description: '',
            file: null,
            type: 'Assignment',
            dueDate: '',
            dueTime: '',
        });

        // Notify lecturer
        setNotification('Assignment uploaded successfully!');
    };

    // Handle marks input change for each student
    const handleMarksChange = (e, studentId) => {
        const { value } = e.target;
        setStudentMarks(prevMarks => {
            const updatedMarks = prevMarks.map(mark =>
                mark.studentId === studentId ? { ...mark, marks: value } : mark
            );
            return updatedMarks;
        });
    };

    // Handle upload of marks
    const handleUploadMarks = () => {
        setMarks([...marks, ...studentMarks]);

        // Notify lecturer
        setNotification('Marks uploaded successfully!');
    };

    return (
        <div className="assignments-container">
            <h1>Manage Assignments, Tests, and Quizzes</h1>

            {/* Assignment Upload Form */}
            <div className="upload-assignment">
                <h3>Upload New Assignment/Test/Quiz</h3>
                <input
                    type="text"
                    name="title"
                    value={assignment.title}
                    onChange={handleAssignmentChange}
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    value={assignment.description}
                    onChange={handleAssignmentChange}
                    placeholder="Description"
                />
                <select
                    name="type"
                    value={assignment.type}
                    onChange={handleAssignmentChange}
                >
                    <option value="Assignment">Assignment</option>
                    <option value="Test">Test</option>
                    <option value="Quiz">Quiz</option>
                </select>
                <input
                    type="date"
                    name="dueDate"
                    value={assignment.dueDate}
                    onChange={handleAssignmentChange}
                />
                <input
                    type="time"
                    name="dueTime"
                    value={assignment.dueTime}
                    onChange={handleAssignmentChange}
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                />
                <button onClick={handleUploadAssignment}>Upload Assignment</button>
            </div>

            {/* Notification Message */}
            {notification && <div className="notification">{notification}</div>}

            {/* Uploaded Assignments List */}
            <div className="uploaded-assignments">
                <h3>Uploaded Assignments</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Due Date</th>
                            <th>Link</th>
                            <th>Upload Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploadedAssignments.map((assignment, index) => (
                            <tr key={index}>
                                <td>{assignment.title}</td>
                                <td>{assignment.type}</td>
                                <td>{assignment.dueDate} {assignment.dueTime}</td>
                                <td><a href={assignment.link} target="_blank" rel="noopener noreferrer">Access</a></td>
                                <td>{assignment.uploadDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Student Marks Upload */}
            <div className="upload-marks">
                <h3>Upload Marks for Students</h3>
                <div className="marks-list">
                    <input
                        type="text"
                        placeholder="Enter Student Name"
                        onChange={(e) => {
                            const newStudent = {
                                studentId: Date.now(),
                                name: e.target.value,
                                marks: '',
                            };
                            setStudentMarks([...studentMarks, newStudent]);
                        }}
                    />
                    {studentMarks.length > 0 && (
                        <div>
                            {studentMarks.map((student, index) => (
                                <div key={student.studentId} className="marks-input">
                                    <label>{student.name}</label>
                                    <input
                                        type="number"
                                        value={student.marks}
                                        onChange={(e) => handleMarksChange(e, student.studentId)}
                                        placeholder="Enter Marks"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={handleUploadMarks}>Upload Marks</button>
                </div>
            </div>
        </div>
    );
}

export default Assignments;
