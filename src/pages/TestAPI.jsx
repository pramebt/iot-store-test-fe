import { useState } from 'react';
import { authService } from '../services/auth.service';
import { productsService } from '../services/products.service';
import { categoriesService } from '../services/categories.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function TestAPI() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, testFn) => {
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const result = await testFn();
      setResults((prev) => ({
        ...prev,
        [name]: { success: true, data: result },
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [name]: { success: false, error: error.message },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const tests = [
    {
      name: 'Health Check',
      fn: async () => {
        const response = await fetch('http://localhost:5000/api/health');
        return await response.json();
      },
    },
    {
      name: 'Get Products',
      fn: () => productsService.getAll({ limit: 5 }),
    },
    {
      name: 'Get Categories',
      fn: () => categoriesService.getAll(),
    },
    {
      name: 'Login (Demo)',
      fn: () => authService.login('admin@example.com', 'admin123'),
    },
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await testEndpoint(test.name, test.fn);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>

      <div className="mb-6">
        <Button onClick={runAllTests}>Run All Tests</Button>
      </div>

      <div className="grid gap-4">
        {tests.map((test) => (
          <Card key={test.name} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{test.name}</h3>
              <Button
                size="sm"
                onClick={() => testEndpoint(test.name, test.fn)}
                disabled={loading[test.name]}
              >
                {loading[test.name] ? 'Testing...' : 'Test'}
              </Button>
            </div>

            {results[test.name] && (
              <div
                className={`p-4 rounded ${
                  results[test.name].success
                    ? 'bg-green-100 border border-green-400'
                    : 'bg-red-100 border border-red-400'
                }`}
              >
                {results[test.name].success ? (
                  <>
                    <div className="font-semibold text-green-700 mb-2">
                      ✓ Success
                    </div>
                    <pre className="text-sm overflow-auto max-h-40">
                      {JSON.stringify(results[test.name].data, null, 2)}
                    </pre>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-red-700 mb-2">
                      ✗ Failed
                    </div>
                    <div className="text-sm text-red-600">
                      {results[test.name].error}
                    </div>
                  </>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure the backend server is running on port 5000</li>
          <li>Click "Run All Tests" or test each endpoint individually</li>
          <li>Check if all tests pass (green) or fail (red)</li>
          <li>If tests fail, check the error messages and server logs</li>
        </ol>
      </div>
    </div>
  );
}
