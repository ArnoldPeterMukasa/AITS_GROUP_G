import React, { useState } from "react";
import { createIssue } from "./Api"; // Make sure path is correct
import "./CreateIssueForm.css";

function CreateIssueForm({ onIssueCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'missing_marks'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            // Validate form
            if (!formData.title.trim() || !formData.description.trim()) {
                throw new Error('Please fill in all required fields');
            }

            // Submit issue
            const response = await createIssue(formData);
            
            // Clear form
            setFormData({
                title: '',
                description: '',
                category: 'missing_marks'
            });

            // Show success message
            setSuccess('Issue created successfully!');
            
            // Notify parent component
            if (onIssueCreated) {
                onIssueCreated(response);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'Failed to create issue');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Create Issue</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="create-issue-form">
                <div className="form-group">
                    <label htmlFor="title">Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter issue title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category*</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="missing_marks">Missing Marks</option>
                        <option value="appeal">Appeal</option>
                        <option value="correction">Correction</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description*</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your issue in detail"
                        required
                        rows="4"
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating...' : 'Create Issue'}
                </button>
            </form>
        </div>
    );
}

export default CreateIssueForm;
