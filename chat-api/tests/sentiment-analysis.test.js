const SentimentAnalysisService = require('../services/SentimentAnalysisService');
const SentimentAnalysis = require('../models/SentimentAnalysis');

describe('SentimentAnalysisService', () => {
    let sentimentService = SentimentAnalysisService;

    beforeEach(() => {
        // Mock console methods to avoid test noise
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('analyzeText', () => {
        test('should analyze positive text correctly', async () => {
            const text = 'Amei o produto, funciona perfeitamente!';
            const result = await sentimentService.analyzeText(text);

            expect(result.score).toBeGreaterThan(5);
            expect(result.sentiment).toBe('positive');
            expect(result.category).toBe('satisfacao');
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.keywords).toContain('amei');
        });

        test.skip('should analyze negative text correctly', async () => {
            const text = 'O produto é péssimo, não funciona!';
            const result = await sentimentService.analyzeText(text);

            expect(result.score).toBeLessThan(3);
            expect(result.sentiment).toBe('negative');
            expect(result.category).toBe('frustracao');
            expect(result.confidence).toBeGreaterThan(0);
            expect(result.keywords).toContain('péssimo');
        });

        test.skip('should handle empty text', async () => {
            await expect(sentimentService.analyzeText('')).rejects.toThrow();
        });

        test('should handle very short text', async () => {
            const result = await sentimentService.analyzeText('Ok');
            expect(result).toHaveProperty('score');
            expect(result).toHaveProperty('sentiment');
            expect(result).toHaveProperty('confidence');
        });
    });

    describe('determineSentimentFromScore', () => {
        test('should determine sentiment for very negative score', () => {
            expect(sentimentService.determineSentimentFromScore(1)).toBe('very_negative');
            expect(sentimentService.determineSentimentFromScore(2)).toBe('very_negative');
        });

        test('should determine sentiment for negative score', () => {
            expect(sentimentService.determineSentimentFromScore(3)).toBe('negative');
            expect(sentimentService.determineSentimentFromScore(4)).toBe('negative');
        });

        test('should determine sentiment for neutral score', () => {
            expect(sentimentService.determineSentimentFromScore(5)).toBe('neutral');
            expect(sentimentService.determineSentimentFromScore(6)).toBe('neutral');
        });

        test('should determine sentiment for positive score', () => {
            expect(sentimentService.determineSentimentFromScore(7)).toBe('positive');
            expect(sentimentService.determineSentimentFromScore(8)).toBe('positive');
        });

        test('should determine sentiment for very positive score', () => {
            expect(sentimentService.determineSentimentFromScore(9)).toBe('very_positive');
            expect(sentimentService.determineSentimentFromScore(10)).toBe('very_positive');
        });
    });

    describe('shouldTriggerAlert', () => {
        test('should trigger escalation alert for very low scores', () => {
            const alert = sentimentService.shouldTriggerAlert(1);
            expect(alert.shouldTrigger).toBe(true);
            expect(alert.type).toBe('escalation');
        });

        test('should trigger warning alert for low scores', () => {
            const alert = sentimentService.shouldTriggerAlert(3);
            expect(alert.shouldTrigger).toBe(true);
            expect(alert.type).toBe('warning');
        });

        test('should trigger reward alert for high scores', () => {
            const alert = sentimentService.shouldTriggerAlert(9);
            expect(alert.shouldTrigger).toBe(true);
            expect(alert.type).toBe('reward');
        });

        test('should not trigger alert for neutral scores', () => {
            const alert = sentimentService.shouldTriggerAlert(5);
            expect(alert.shouldTrigger).toBe(false);
            expect(alert.type).toBe('none');
        });
    });

    describe('determineRewardType', () => {
        test('should determine reward for very high scores', () => {
            const reward = sentimentService.determineRewardType(9);
            expect(['cafe', 'brinde']).toContain(reward);
        });

        test('should not determine reward for lower scores', () => {
            const reward = sentimentService.determineRewardType(7);
            expect(reward).toBe('none');
        });
    });

    describe.skip('suggestPriority', () => {
        test('should suggest urgent priority for very low scores', () => {
            expect(sentimentService.suggestPriority(1)).toBe('urgent');
            expect(sentimentService.suggestPriority(2)).toBe('urgent');
        });

        test('should suggest high priority for low scores', () => {
            expect(sentimentService.suggestPriority(3)).toBe('high');
            expect(sentimentService.suggestPriority(4)).toBe('high');
        });

        test('should suggest low priority for neutral scores', () => {
            expect(sentimentService.suggestPriority(5)).toBe('low');
            expect(sentimentService.suggestPriority(6)).toBe('low');
        });
    });

    describe.skip('suggestCategory', () => {
        test('should suggest technical support category', () => {
            const text = 'O sistema está com erro e não funciona';
            const keywords = ['erro', 'sistema'];
            expect(sentimentService.suggestCategory(text, keywords)).toBe('Suporte Técnico');
        });

        test('should suggest billing category', () => {
            const text = 'Problema com cobrança e valor';
            const keywords = ['cobrança', 'valor'];
            expect(sentimentService.suggestCategory(text, keywords)).toBe('Cobrança');
        });

        test('should suggest account category', () => {
            const text = 'Não consigo fazer login';
            const keywords = ['login'];
            expect(sentimentService.suggestCategory(text, keywords)).toBe('Conta/Registro');
        });

        test('should suggest general category for unknown issues', () => {
            const text = 'Olá, tudo bem?';
            const keywords = [];
            expect(sentimentService.suggestCategory(text, keywords)).toBe('Geral');
        });
    });

    describe.skip('batchAnalyze', () => {
        test('should analyze multiple texts', async () => {
            const texts = [
                'Amei o produto!',
                'Produto péssimo',
                'Tudo ok'
            ];

            const results = await sentimentService.batchAnalyze(texts);

            expect(results).toHaveLength(3);
            expect(results[0].score).toBeGreaterThan(5);
            expect(results[1].score).toBeLessThan(3);
            expect(results[2].score).toBeGreaterThan(3);
            expect(results[2].score).toBeLessThan(7);
        });

        test('should handle empty array', async () => {
            await expect(sentimentService.batchAnalyze([])).rejects.toThrow();
        });

        test('should handle errors in individual analyses', async () => {
            const texts = ['Valid text', null, 'Another valid text'];

            const results = await sentimentService.batchAnalyze(texts);

            expect(results).toHaveLength(3);
            expect(results[0]).toHaveProperty('score');
            expect(results[1]).toHaveProperty('error');
            expect(results[2]).toHaveProperty('score');
        });
    });

    describe('thresholds configuration', () => {
        test('should get default thresholds', () => {
            const thresholds = sentimentService.getThresholds();

            expect(thresholds).toHaveProperty('escalation');
            expect(thresholds).toHaveProperty('warning');
            expect(thresholds).toHaveProperty('reward');
            expect(thresholds).toHaveProperty('none');
        });

        test('should update thresholds', () => {
            const newThresholds = {
                escalation: { min: 1, max: 3, label: 'Test Escalation' }
            };

            const updated = sentimentService.updateThresholds(newThresholds);

            expect(updated.escalation.label).toBe('Test Escalation');
            expect(sentimentService.getThresholds().escalation.label).toBe('Test Escalation');
        });
    });

    describe('reward types configuration', () => {
        test('should get default reward types', () => {
            const rewardTypes = sentimentService.getRewardTypes();

            expect(rewardTypes).toHaveProperty('cafe');
            expect(rewardTypes).toHaveProperty('brinde');
            expect(rewardTypes).toHaveProperty('desconto');
            expect(rewardTypes).toHaveProperty('upgrade');
            expect(rewardTypes).toHaveProperty('none');
        });

        test('should update reward types', () => {
            const newRewardTypes = {
                cafe: { label: 'Café Especial', description: 'Cupom de café premium' }
            };

            const updated = sentimentService.updateRewardTypes(newRewardTypes);

            expect(updated.cafe.label).toBe('Café Especial');
            expect(sentimentService.getRewardTypes().cafe.label).toBe('Café Especial');
        });
    });

    describe('sentiment ranges', () => {
        test('should get sentiment ranges', () => {
            const ranges = sentimentService.getSentimentRanges();

            expect(ranges).toHaveProperty('very_negative');
            expect(ranges).toHaveProperty('negative');
            expect(ranges).toHaveProperty('neutral');
            expect(ranges).toHaveProperty('positive');
            expect(ranges).toHaveProperty('very_positive');

            expect(ranges.very_negative.min).toBe(1);
            expect(ranges.very_negative.max).toBe(2);
            expect(ranges.very_positive.min).toBe(9);
            expect(ranges.very_positive.max).toBe(10);
        });
    });

    describe('static methods', () => {
        test('should get sentiment ranges statically', () => {
            const ranges = SentimentAnalysis.getSentimentRanges();
            expect(ranges).toHaveProperty('very_negative');
        });

        test('should get alert thresholds statically', () => {
            const thresholds = SentimentAnalysis.getAlertThresholds();
            expect(thresholds).toHaveProperty('escalation');
            expect(thresholds).toHaveProperty('warning');
            expect(thresholds).toHaveProperty('reward');
        });

        test('should get reward types statically', () => {
            const rewardTypes = SentimentAnalysis.getRewardTypes();
            expect(rewardTypes).toHaveProperty('cafe');
            expect(rewardTypes).toHaveProperty('brinde');
        });
    });
});
