import { Outlet } from "react-router-dom"; // Import the Outlet component
import Nav from "./ui/Nav";

function App() {
  return (
    <div>
      <Nav />
      <Outlet /> {/* This renders the matched child route */}
    </div>
  );
}

export default App;
