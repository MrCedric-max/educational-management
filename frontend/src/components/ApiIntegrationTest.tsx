import React, { useState } from 'react';
import { useApi } from '../contexts/ApiContext';
import api from '../services/api';

const ApiIntegrationTest: React.FC = () => {
  const { state } = useApi();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    const results: any[] = [];

    try {
      // Test 1: Health Check
      try {
        const healthResponse = await fetch('http://localhost:3001/health');
        const healthData = await healthResponse.json();
        results.push({
          test: 'Health Check',
          status: 'PASS',
          data: healthData,
          endpoint: 'GET /health'
        });
      } catch (error) {
        results.push({
          test: 'Health Check',
          status: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint: 'GET /health'
        });
      }

      // Test 2: API Test Endpoint
      try {
        const testResponse = await fetch('http://localhost:3001/api/test');
        const testData = await testResponse.json();
        results.push({
          test: 'API Test',
          status: 'PASS',
          data: testData,
          endpoint: 'GET /api/test'
        });
      } catch (error) {
        results.push({
          test: 'API Test',
          status: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint: 'GET /api/test'
        });
      }

      // Test 3: Users Endpoint
      try {
        const usersResponse = await fetch('http://localhost:3001/api/users');
        const usersData = await usersResponse.json();
        results.push({
          test: 'Users API',
          status: 'PASS',
          data: usersData,
          endpoint: 'GET /api/users'
        });
      } catch (error) {
        results.push({
          test: 'Users API',
          status: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint: 'GET /api/users'
        });
      }

      // Test 4: Login API
      try {
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });
        const loginData = await loginResponse.json();
        results.push({
          test: 'Login API',
          status: 'PASS',
          data: loginData,
          endpoint: 'POST /api/auth/login'
        });
      } catch (error) {
        results.push({
          test: 'Login API',
          status: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint: 'POST /api/auth/login'
        });
      }

      // Test 5: Frontend API Service Integration
      try {
        const apiResponse = await api.auth.login({
          email: 'test@example.com',
          password: 'password123'
        });
        results.push({
          test: 'Frontend API Service',
          status: 'PASS',
          data: apiResponse,
          endpoint: 'Frontend API Service'
        });
      } catch (error) {
        results.push({
          test: 'Frontend API Service',
          status: 'FAIL',
          error: error instanceof Error ? error.message : 'Unknown error',
          endpoint: 'Frontend API Service'
        });
      }

    } catch (error) {
      results.push({
        test: 'Test Suite',
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        endpoint: 'Test Suite'
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">API Integration Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Running Tests...' : 'Run Integration Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded border-l-4 ${
              result.status === 'PASS'
                ? 'bg-green-50 border-green-500'
                : result.status === 'FAIL'
                ? 'bg-red-50 border-red-500'
                : 'bg-yellow-50 border-yellow-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{result.test}</h3>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  result.status === 'PASS'
                    ? 'bg-green-100 text-green-800'
                    : result.status === 'FAIL'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {result.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{result.endpoint}</p>
            {result.error && (
              <p className="text-sm text-red-600 mt-2">Error: {result.error}</p>
            )}
            {result.data && (
              <details className="mt-2">
                <summary className="text-sm text-gray-600 cursor-pointer">
                  View Response Data
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p>
            Passed: {testResults.filter(r => r.status === 'PASS').length} / {testResults.length}
          </p>
          <p>
            Failed: {testResults.filter(r => r.status === 'FAIL').length} / {testResults.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationTest;




