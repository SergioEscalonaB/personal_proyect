import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router";
import AbonoPage from "./pages/AbonoPagina.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AbonoPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
