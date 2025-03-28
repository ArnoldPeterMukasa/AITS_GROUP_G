import { Outlet } from "react-router-dom";
import AcademicRegistrarDashboard from "./components/AcademicRegistrarDashboard";

function App() {
  return (
    <>
        <div>
      <Outlet />
      <AcademicRegistrarDashboard />
        </div>
    </>
    
  );
}
export default App;