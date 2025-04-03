import React, { useState } from "react";
import { createIssue } from "./Api"; // Adjust the path to your Api.jsx file

function CreateIssueForm() {
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Missing Marks");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        try {
            const issueData = { description, type };
            const response = await createIssue(issueData); // Call the API function
            if (response.status === 201) { // Assuming 201 is the success status code
                setMessage("Issue created successfully!");
                console.log("Issue created:", response.data);
                setDescription(""); // Clear the description field
                setType("Missing Marks"); // Reset the type field
            } else {
                setMessage("Failed to create issue. Please try again.");
            }
        } catch (error) {
            console.error("Error creating issue:", error);
            setMessage("Failed to create issue.");
        } finally {
            setLoading(false); // Set loading to false
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
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create Issue"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default CreateIssueForm;