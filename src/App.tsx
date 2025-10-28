import { Link, Route, Routes } from "react-router-dom";
import { MouseCursorOnlyPage } from "./pages/MouseCursorOnlyPage";
import { OriginalPage } from "./pages/OriginalPage";

function App() {
  return (
    <div>
      <div className="app">
        <nav>
          <ul>
            <li>
              <Link to="/">Original</Link>
            </li>
            <li>
              <Link to="/mouseCursorOnlyPage">MouseCursorOnlyPage</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<OriginalPage />} />
          <Route
            path="/mouseCursorOnlyPage"
            element={<MouseCursorOnlyPage />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
