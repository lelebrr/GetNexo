module.exports = {
    GoogleSpreadsheet: class GoogleSpreadsheet {
        constructor() { }
        useServiceAccountAuth() { return Promise.resolve(); }
        loadInfo() { return Promise.resolve(); }
        sheetsByIndex = [];
    }
};