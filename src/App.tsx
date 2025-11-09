import { Link, Route, Routes } from "react-router-dom";
import { MouseCursorOnlyPage } from "./pages/MouseCursorOnlyPage";
import { OriginalPage } from "./pages/OriginalPage";
import { HooksMouseCursorOnlyPage } from "./pages/HooksMouseCursorOnlyPage";
import { MultipageHooksMouseCursorOnlyPage } from "./pages/MultipageHooksMouseCursorOnlyPage";
import { CustomPageComponent } from "./pages/CustomPageComponent";
import { CustomPageComponentWithRedaction } from "./pages/CustomPageComponentWithRedaction";

const routeDataMap = {
  OriginalPage,
  MouseCursorOnlyPage,
  HooksMouseCursorOnlyPage,
  MultipageHooksMouseCursorOnlyPage,
  CustomPageComponent,
  CustomPageComponentWithRedaction,
};
const routeData = Object.entries(routeDataMap).map(([path, element]) => ({
  path: `/${path}`,
  element,
}));

function App() {
  return (
    <div>
      <div className="app">
        <nav>
          <ul>
            {routeData.map((x) => (
              <li key={x.path}>
                <Link to={x.path}>{x.path}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          {routeData.map((x) => (
            <Route key={x.path} path={x.path} element={<x.element />} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default App;
