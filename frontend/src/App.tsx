// import { dotenv } from "dotenv";
import Router from "./routers/Routers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Course from "./components/Card/Course";
// import OpenViduSession from "openvidu-react";

// const BACKEND_ADDRESS = import.meta.env.VITE_BACKEND_ADDRESS;

function App() {
  return (
    <div>
      <Router />
      <ToastContainer />
    </div>
  );
}

export default App;
