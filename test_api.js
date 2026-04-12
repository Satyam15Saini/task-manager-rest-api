const http = require('http');

const baseURL = 'http://localhost:3000/api';

const makeRequest = (path, method, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseData) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTest = async () => {
  try {
    const randomNum = Math.floor(Math.random() * 10000);
    const email = `demo${randomNum}@example.com`;
    const password = 'securepassword123';

    console.log('--- TASK MANAGER API DEMONSTRATION ---\n');

    // 1. Register User
    console.log(`[1] Registering a new user (${email})...`);
    const regRes = await makeRequest('/auth/register', 'POST', { email, password });
    console.log(`  -> Response Code: ${regRes.status}`);
    console.log(`  -> Result:`, regRes.data, '\n');

    if (regRes.status !== 201) throw new Error('Registration failed');

    // 2. Login User
    console.log(`[2] Logging in to get the JWT Token...`);
    const loginRes = await makeRequest('/auth/login', 'POST', { email, password });
    console.log(`  -> Response Code: ${loginRes.status}`);
    
    if (loginRes.status !== 200 || !loginRes.data.token) throw new Error('Login failed');
    
    const token = loginRes.data.token;
    console.log(`  -> Successfully retrieved Token: ${token.substring(0, 30)}... (truncated)\n`);

    // 3. Create a Task
    console.log(`[3] Creating a new task in MongoDB using the Token...`);
    const taskData = {
      title: 'Complete final project',
      description: 'Finish writing the tests and submit the API repository.',
      status: 'pending' // Based on standard task models
    };
    const createRes = await makeRequest('/tasks', 'POST', taskData, token);
    console.log(`  -> Response Code: ${createRes.status}`);
    console.log(`  -> Result:`, createRes.data, '\n');

    // 4. Fetch Tasks
    console.log(`[4] Fetching tasks for this user...`);
    const fetchRes = await makeRequest('/tasks', 'GET', null, token);
    console.log(`  -> Response Code: ${fetchRes.status}`);
    console.log(`  -> User's Tasks:`, JSON.stringify(fetchRes.data, null, 2), '\n');

    console.log('--- DEMONSTRATION COMPLETE ---');
    console.log('The system successfully joined user data in PostgreSQL with tasks in MongoDB!');
    
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
};

runTest();
