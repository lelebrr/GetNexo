const axios = require('axios');

const API_BASE = 'http://localhost:3006';

// Test login function
async function login(email, password) {
    try {
        const response = await axios.post(`${API_BASE}/api/login`, { email, password });
        return response.data.token;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
}

// Test dashboard APIs
async function testDashboards() {
    console.log('🧪 Testing Dashboard APIs...\n');

    // Test 1: Admin login
    console.log('1. Testing admin login...');
    const adminToken = await login('lelebrr@gmail.com', '@Marlboro123#');
    if (!adminToken) {
        console.log('❌ Admin login failed, skipping other tests\n');
        return;
    }
    console.log('✅ Admin login successful\n');

    // Test 2: Admin dashboard (if applicable)
    console.log('2. Testing admin dashboard...');
    try {
        const response = await axios.get(`${API_BASE}/api/dashboard`, {
            headers: { Authorization: adminToken }
        });
        console.log('✅ Admin dashboard loaded:', {
            projects: response.data.activeProjects,
            services: response.data.activeServices?.length,
            spend: response.data.monthlySpend
        });
    } catch (error) {
        console.log('❌ Admin dashboard error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 3: Reseller login
    console.log('3. Testing reseller login...');
    const resellerToken = await login('revendedor@getnexo.com', 'reseller123');
    if (!resellerToken) {
        console.log('⚠️  Reseller not found, creating one...');
        try {
            await axios.post(`${API_BASE}/api/users`, {
                email: 'revendedor@getnexo.com',
                password: 'reseller123',
                role_id: 2
            }, {
                headers: { Authorization: adminToken }
            });
            // Set as reseller
            const user = await axios.get(`${API_BASE}/api/users`, {
                headers: { Authorization: adminToken }
            });
            const resellerUser = user.data.find(u => u.email === 'revendedor@getnexo.com');
            if (resellerUser) {
                // Note: Would need to add reseller flag via SQL or another endpoint
                console.log('Reseller created, but manual setup needed');
            }
        } catch (e) {
            console.log('Failed to create reseller');
        }
        return;
    }
    console.log('✅ Reseller login successful\n');

    // Test 4: Reseller dashboard
    console.log('4. Testing reseller dashboard...');
    try {
        const response = await axios.get(`${API_BASE}/api/revenda/dashboard`, {
            headers: { Authorization: resellerToken }
        });
        console.log('✅ Reseller dashboard loaded:', {
            revenue: response.data.totalRevenue,
            commission: response.data.monthlyCommission,
            clients: response.data.activeClients
        });
    } catch (error) {
        console.log('❌ Reseller dashboard error:', error.response?.data || error.message);
    }
    console.log('');

    // Test 5: Reseller stats
    console.log('5. Testing reseller stats...');
    try {
        const response = await axios.get(`${API_BASE}/api/revenda/stats`, {
            headers: { Authorization: resellerToken }
        });
        console.log('✅ Reseller stats loaded:', {
            balance: response.data.balance,
            clients: response.data.clientsCount,
            code: response.data.code
        });
    } catch (error) {
        console.log('❌ Reseller stats error:', error.response?.data || error.message);
    }

    console.log('\n🎉 Dashboard API tests completed!');
}

// Run tests
if (require.main === module) {
    testDashboards().catch(console.error);
}

module.exports = { testDashboards };