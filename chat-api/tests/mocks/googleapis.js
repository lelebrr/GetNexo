module.exports = {
    google: {
        auth: {
            GoogleAuth: class GoogleAuth { }
        },
        sheets: jest.fn(() => ({
            spreadsheets: {
                values: {
                    get: jest.fn(() => Promise.resolve({ data: { values: [] } })),
                    update: jest.fn(() => Promise.resolve({ data: {} }))
                }
            }
        }))
    }
};