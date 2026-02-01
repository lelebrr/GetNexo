const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const clientUsageRoutes = require('./routes/clientUsage');
const adminUsageRoutes = require('./routes/adminUsage');
const installWebhook = require('./routes/installWebhook');

app.use(authRoutes);
app.use('/api/v1', clientUsageRoutes); // As per prompt usage example
app.use('/api/admin/v1', adminUsageRoutes);
app.use(installWebhook);

app.listen(port, () => {
    console.log(`API Central running on port ${port}`);
});
