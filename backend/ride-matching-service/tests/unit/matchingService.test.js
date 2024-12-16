// tests/unit/matchingService.test.js

import matchingService from '../../src/services/matchingService.js';
import Driver from '../../src/models/Driver.js';
import { mockRequest, mockResponse } from '../utils/testUtils.js';

jest.mock('../../src/models/Driver.js');

describe('Matching Service', () => {
    it('should find the nearest driver', async () => {
        const mockDriver = {
            _id: '123',
            location: { type: 'Point', coordinates: [50, 50] },
            isAvailable: true,
        };

        Driver.findOne = jest.fn().mockResolvedValue(mockDriver);

        const result = await matchingService.findNearestDriver({ coordinates: [50, 50] });

        expect(result._id).toBe('123');
        expect(result.isAvailable).toBe(true);
    });

    it('should return null if no drivers are available', async () => {
        Driver.findOne = jest.fn().mockResolvedValue(null);

        const result = await matchingService.findNearestDriver({ coordinates: [50, 50] });

        expect(result).toBeNull();
    });
});
