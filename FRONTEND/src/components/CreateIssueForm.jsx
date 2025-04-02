import React, { useState } from "react";
import { createIssue } from "./Api"; // Adjust the path to your Api.jsx file

function CreateIssueForm() {
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Missing Marks");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const issueData = { description, type };
            const response = await createIssue(issueData); // Call the API function
            setMessage("Issue created successfully!");
            console.log("Issue created:", response);
        } catch (error) {
            console.error("Error creating issue:", error);
            setMessage("Failed to create issue.");
        }
    };

    return (
        <div>
            <h1>Create Issue</h1>
            <form onSubmit={handleSubmit}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Missing Marks">Missing Marks</option>
                    <option value="Appeal">Appeal</option>
                    <option value="Correction for Marks">Correction for Marks</option>
                </select>
                <input
                    type="text"
                    placeholder="Enter issue description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Create Issue</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateIssueForm;