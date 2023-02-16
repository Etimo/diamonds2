import { useState } from "react";
import reactLogo from "./assets/react.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-screen h-screen bg-blue-400 flex justify-center items-center">
      <div className="flex items-center flex-col gap-y-4">
        <div className="flex gap-x-6">
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="text-sm flex flex-col justify-center">
          <button
            onClick={() => setCount(count => count + 1)}
            className="px-6 py-3 bg-red-600 rounded-xl mb-2"
          >
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
}

export default App;
