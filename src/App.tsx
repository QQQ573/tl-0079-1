import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatrixPage from "@/pages/MatrixPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MatrixPage />} />
      </Routes>
    </Router>
  );
}
