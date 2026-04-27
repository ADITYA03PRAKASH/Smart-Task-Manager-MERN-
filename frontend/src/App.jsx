import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from './pages/Login';
import Signup from "./pages/Signup";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>

            {/* Default route → redirect to signup */}
            <Route path="/login"    element={<Login />} />
            <Route path="/" element={<Navigate to="/signup" />} />

            {/* Signup route */}
            <Route path="/signup" element={<Signup />} />

          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;