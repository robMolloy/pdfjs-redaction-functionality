import { Link, Route, Routes } from "react-router-dom";
import { MouseCursorOnlyPage } from "./pages/MouseCursorOnlyPage";
import { OriginalPage } from "./pages/OriginalPage";
import { HooksMouseCursorOnlyPage } from "./pages/HooksMouseCursorOnlyPage";

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
            <li>
              <Link to="/hooksMouseCursorOnlyPage">
                HooksMouseCursorOnlyPage
              </Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<OriginalPage />} />
          <Route
            path="/mouseCursorOnlyPage"
            element={<MouseCursorOnlyPage />}
          />
          <Route
            path="/hooksMouseCursorOnlyPage"
            element={<HooksMouseCursorOnlyPage />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
