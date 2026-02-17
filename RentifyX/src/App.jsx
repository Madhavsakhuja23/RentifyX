import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dwellings from "./pages/Dwellings";

function App() {
  return (
    <>
<<<<<<< HEAD
      <div>

        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
=======
      <Dwellings />
>>>>>>> cb21056 (dwellings page)
    </>
  );
}

export default App;
