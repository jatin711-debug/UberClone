// tests/utils/testUtils.js

module.exports.mockDriver = {
    _id: 'driver123',
    name: 'Driver 1',
    location: { type: 'Point', coordinates: [50, 50] },
    isAvailable: true
};

module.exports.mockRider = {
    _id: 'rider123',
    name: 'Rider 1',
    location: { type: 'Point', coordinates: [50, 50] }
};
