import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold text-blue-600">
          Educational Management System
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Frontend is running successfully! 🎉
        </p>
        <div className="mt-8 p-4 bg-green-100 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">
            Monorepo Structure Active
          </h2>
          <ul className="text-left text-green-700 mt-2">
            <li>✅ Frontend: React app on port 3000</li>
            <li>✅ Backend: Express server on port 3001</li>
            <li>✅ Proxy configured for API calls</li>
            <li>✅ Clean separation of concerns</li>
          </ul>
        </div>
        <div className="mt-6">
          <a 
            href="http://localhost:3001/health" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Backend API
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;



