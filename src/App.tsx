import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Link, Route, Routes } from "react-router-dom";
import { AboutPage } from "./pages/AboutPage";
import { OriginalPage } from "./pages/OriginalPage";

function App() {
  return (
    <div>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<OriginalPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
