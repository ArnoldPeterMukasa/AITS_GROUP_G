import React, { useState } from "react";
import { createIssue } from "./Api"; // Make sure path is correct

function CreateIssueForm({ onIssueCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("missing_marks");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const issueData = {
                title,
                description,
                category,
            };

            const response = await createIssue(issueData);

            // ✅ Adjust depending on your API structure
            if (response && response.id) {
                setMessage("Issue created successfully!");
                setTitle("");
                setDescription("");
                setCategory("missing_marks");

                // Optional: Update issues in parent
                if (onIssueCreated) {
                    onIssueCreated(response);
                }

                console.log("Issue created:", response);
            } else {
                setMessage("Failed to create issue. Please try again.");
            }
        } catch (error) {
            console.error("Error creating issue:", error);
        
            if (error.response && error.response.data) {
                console.error("Django says:", error.response.data);
                setMessage(`Validation error: ${JSON.stringify(error.response.data)}`);
            } else {
                setMessage("Failed to create issue.");
            }
        }
         finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Issue</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Issue title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Enter issue description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="missing_marks">Missing Marks</option>
                    <option value="appeal">Appeal</option>
                    <option value="correction">Correction for Marks</option>
                    <option value="other">Other</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create Issue"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateIssueForm;
