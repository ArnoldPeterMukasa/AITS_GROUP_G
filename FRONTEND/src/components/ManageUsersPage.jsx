import React, { useState, useEffect } from 'react';
import './ManageUsersPage.css'; // Import your CSS file for styling

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({
        role: '',
        department: '',
        status: '',
    });
    const [search, setSearch] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        role: 'Student',  // Default role
        department: '',
    });
    const [addedUser, setAddedUser] = useState(null);  // Track the recently added user
    const [editingUser, setEditingUser] = useState(null); // Track user being edited

    useEffect(() => {
        // Fetch users from an API or use sample data
        setUsers([

        ]);
    }, []);

    const handleAddUser = () => {
        const userId = users.length + 1;  // Generate a unique ID based on existing users
        const newUserObj = {
            id: userId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            department: newUser.department,
            status: 'Active',
            dateJoined: new Date().toLocaleDateString(),
        };

        // Add new user to the list
        setUsers([...users, newUserObj]);
        setAddedUser(newUserObj);  // Set the recently added user to show its credentials

        // Clear the form after adding user
        setNewUser({
            name: '',
            email: '',
            role: 'Student',
            department: '',
        });
    };

    const handleEditUser = (user) => {
        // Set the user to be edited
        setEditingUser(user);
    };

    const handleSaveEditedUser = () => {
        // Update the user in the list with the edited values
        setUsers(users.map(user => 
            user.id === editingUser.id ? editingUser : user
        ));
        setEditingUser(null); // Clear the editing state
    };

    const handleCancelEdit = () => {
        // Cancel editing by clearing the editing state
        setEditingUser(null);
    };

    const handleRemoveUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const handleDeactivateUser = (id) => {
        setUsers(users.map(user => 
            user.id === id ? { ...user, status: 'Inactive' } : user
        ));
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditingUser({ ...editingUser, [name]: value });
    };

    // Filter and search users based on selected filters and search term
    const filteredUsers = users.filter(user => {
        return (
            (filters.role === '' || user.role === filters.role) &&
            (filters.department === '' || user.department === filters.department) &&
            (filters.status === '' || user.status === filters.status) &&
            (user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase()))
        );
    });

    return (
        <div className="manage-users">
            <h1>Manage Users</h1>

            {/* Add New User Form */}
            <div className="add-user-form">
                <h3>Add New User</h3>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Registrar">Registrar</option>
                </select>
                <input
                    type="text"
                    placeholder="Department"
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                />
                <button onClick={handleAddUser}>Add User</button>
            </div>

            {/* Show the recently added user */}
            {addedUser && (
                <div className="added-user">
                    <h3>New User Added!</h3>
                    <p><strong>Name:</strong> {addedUser.name}</p>
                    <p><strong>Email:</strong> {addedUser.email}</p>
                    <p><strong>Role:</strong> {addedUser.role}</p>
                    <p><strong>Status:</strong> {addedUser.status}</p>
                    <p><strong>Date Joined:</strong> {addedUser.dateJoined}</p>
                </div>
            )}

            {/* Show the edit form if editing a user */}
            {editingUser && (
                <div className="edit-user-form">
                    <h3>Edit User</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editingUser.name}
                        onChange={handleEditFieldChange}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={editingUser.email}
                        onChange={handleEditFieldChange}
                    />
                    <select
                        name="role"
                        value={editingUser.role}
                        onChange={handleEditFieldChange}
                    >
                        <option value="Student">Student</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Registrar">Registrar</option>
                    </select>
                    <input
                        type="text"
                        name="department"
                        placeholder="Department"
                        value={editingUser.department}
                        onChange={handleEditFieldChange}
                    />
                    <button onClick={handleSaveEditedUser}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            )}

            {/* Search and Filter Controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Name or Email"
                    value={search}
                    onChange={handleSearchChange}
                />
                <select name="role" onChange={handleFilterChange} value={filters.role}>
                    <option value="">All Roles</option>
                    <option value="Student">Student</option>
                    <option value="Lecturer">Lecturer</option>
                    <option value="Registrar">Registrar</option>
                </select>
                <select name="department" onChange={handleFilterChange} value={filters.department}>
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="information technology">Information technology</option>
                </select>
                <select name="status" onChange={handleFilterChange} value={filters.status}>
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* User Table */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Date Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                            <td>{user.status}</td>
                            <td>{user.dateJoined}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)}>Edit</button>
                                <button onClick={() => handleDeactivateUser(user.id)}>Deactivate</button>
                                <button onClick={() => handleRemoveUser(user.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsersPage;
