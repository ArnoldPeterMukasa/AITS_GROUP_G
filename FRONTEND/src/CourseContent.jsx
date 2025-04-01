import React, { useState } from 'react';
import './CourseContent.css'; // Import your CSS file for styling

const CourseContent = () => {
    const [content, setContent] = useState([]); // Holds the uploaded course content
    const [newContent, setNewContent] = useState({
        chapter: '',
        title: '',
        description: '',
        type: 'Slide', // Default type
        file: null, // File to upload
    });
    const [uploadDate, setUploadDate] = useState(''); // Date when the content is uploaded

    // Handles the change of input fields for new content
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContent({
            ...newContent,
            [name]: value,
        });
    };

    // Handles the file selection for uploading
    const handleFileChange = (e) => {
        setNewContent({
            ...newContent,
            file: e.target.files[0],
        });
    };

    // Handles the upload date change
    const handleDateChange = (e) => {
        setUploadDate(e.target.value);
    };

    // Handles the adding of new course content
    const handleAddContent = () => {
        // Create the new content object
        const newContentItem = {
            ...newContent,
            uploadDate: uploadDate || new Date().toLocaleDateString(), // Use current date if none is specified
        };

        // Add the new content to the list
        setContent([...content, newContentItem]);

        // Clear the form after adding content
        setNewContent({
            chapter: '',
            title: '',
            description: '',
            type: 'Slide',
            file: null,
        });
        setUploadDate('');
    };

    return (
        <div className="course-content">
            <h1>Course Content</h1>

            {/* Upload Form for Course Content */}
            <div className="upload-form">
                <h3>Upload Course Material</h3>
                <input
                    type="text"
                    name="chapter"
                    placeholder="Chapter Name"
                    value={newContent.chapter}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title of the Content"
                    value={newContent.title}
                    onChange={handleInputChange}
                />
                <textarea
                    name="description"
                    placeholder="Description of the content"
                    value={newContent.description}
                    onChange={handleInputChange}
                />
                <select
                    name="type"
                    value={newContent.type}
                    onChange={handleInputChange}
                >
                    <option value="Slide">Slide</option>
                    <option value="Textbook">Textbook</option>
                    <option value="Reference Book">Reference Book</option>
                </select>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf, .ppt, .pptx, .doc, .docx"
                />
                <input
                    type="date"
                    value={uploadDate}
                    onChange={handleDateChange}
                />
                <button onClick={handleAddContent}>Upload Content</button>
            </div>

            {/* Uploaded Course Content List */}
            <div className="content-list">
                <h3>Uploaded Course Materials</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Chapter</th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Upload Date</th>
                            <th>File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content.map((item, index) => (
                            <tr key={index}>
                                <td>{item.chapter}</td>
                                <td>{item.title}</td>
                                <td>{item.type}</td>
                                <td>{item.uploadDate}</td>
                                <td>
                                    {item.file ? (
                                        <a href={URL.createObjectURL(item.file)} download>
                                            Download
                                        </a>
                                    ) : (
                                        'No file uploaded'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseContent;
