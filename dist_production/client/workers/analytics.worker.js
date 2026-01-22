// Analytics Worker - Offloads heavy math from Main Thread

self.onmessage = (e) => {
    const { type, data } = e.data;

    if (type === 'CALC_METRICS') {
        const result = calculateMetrics(data);
        self.postMessage({ type: 'METRICS_RESULT', data: result });
    }
};

function calculateMetrics(rawData) {
    // Simulate heavy loop / data processing
    // In real scenario: processing thousands of transaction rows

    // 1. Calculate Total Revenue
    const revenue = rawData.sales.reduce((acc, curr) => acc + curr, 0);

    // 2. Calculate Growth (vs previous period)
    const prevRevenue = rawData.prevSales || (revenue * 0.8); // mock prev if missing
    const growth = ((revenue - prevRevenue) / prevRevenue) * 100;

    // 3. Predictive Forecast (Linear Regression approximation)
    const forecastNextWeek = revenue * (1 + (growth / 100));

    // 4. Calculate ROI (Return on Investment)
    // Assuming mock ad spend
    const adSpend = 500;
    const roi = ((revenue - adSpend) / adSpend) * 100;

    // 5. Heavy Loop Simulation (for "Worker" demonstration)
    let checksum = 0;
    for (let i = 0; i < 1e6; i++) {
        checksum += Math.sqrt(i) / 2;
    }

    return {
        revenue,
        growth: growth.toFixed(1),
        forecast: forecastNextWeek.toFixed(2),
        roi: roi.toFixed(1),
        checksum // just to verify work done
    };
}
