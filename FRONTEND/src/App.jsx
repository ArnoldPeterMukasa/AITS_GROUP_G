import { useEffect,useState } from "react";
import { Outlet } from "react-router-dom";
import {getUsers} from "./api"; // Assuming you have an API function to fetch users

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {getUsers().then((data) => {
    setUsers(data);
  })}, []);
  return (
    <>
        <div>
          <h1>User list</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.first_name} {user.last_name} ({user.username})
              </li>
            ))}
          </ul>
      <Outlet />
      
        </div>
    </>
    
  );
}
export default App;