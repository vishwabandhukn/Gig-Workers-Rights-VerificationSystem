const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
    console.log('createTrip called');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    try {
        const { platform, tripId, startTime, endTime, gpsPath, meta } = req.body;
        const trip = new Trip({
            userId: req.user.userId,
            platform,
            tripId,
            startTime,
            endTime,
            gpsPath,
            meta
        });
        const savedTrip = await trip.save();
        console.log('Saved Trip:', savedTrip);
        res.status(201).json({ _id: trip._id });
    } catch (error) {
        console.error('createTrip Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTrips = async (req, res) => {
    console.log('getTrips called for user:', req.params.userId);
    try {
        const trips = await Trip.find({ userId: req.params.userId }).sort({ startTime: -1 });
        console.log('Found trips items:', trips.length);
        res.json({ items: trips });
    } catch (error) {
        console.error('getTrips Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
