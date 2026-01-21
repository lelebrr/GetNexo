// Global function for demo account filling
window.fillDemo = function (type) {
    const demoAccounts = {
        admin: { email: 'admin@getnexo.local', password: 'admin123' },
        reseller: { email: 'revendedor@getnexo.com', password: 'reseller123' },
        client: { email: 'cliente@getnexo.com', password: 'cliente123' }
    };

    const account = demoAccounts[type];
    if (account) {
        document.getElementById('email').value = account.email;
        document.getElementById('password').value = account.password;
    }
};