// tests/integration/matchController.test.js

import request from 'supertest';
import app from '../../src/index.js'; // Assuming app is exported from index.js

jest.mock('../../src/services/matchingService.js');
jest.mock('../../src/kafka/producer.js'); // Mock Kafka producer

describe('Match Controller', () => {
    it('should return a matched driver', async () => {
        const matchInfo = {
            riderId: 'rider123',
            location: { coordinates: [50, 50] }
        };

        const mockDriver = { _id: 'driver123' };
        matchingService.findNearestDriver = jest.fn().mockResolvedValue(mockDriver);

        const response = await request(app)
            .post('/api/match/find')
            .send(matchInfo)
            .expect(200);

        expect(response.body.message).toBe('Driver matched successfully');
        expect(response.body.matchInfo.driverId).toBe('driver123');
    });

    it('should return 404 if no driver is found', async () => {
        const matchInfo = {
            riderId: 'rider123',
            location: { coordinates: [50, 50] }
        };

        matchingService.findNearestDriver = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/api/match/find')
            .send(matchInfo)
            .expect(404);

        expect(response.body.message).toBe('No available drivers found');
    });
});
