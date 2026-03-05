import Trip from "../models/trip.js";

export const createTrip = async (req, res) => {
    try {
        const { userID, date, earning, description } = req.body;
        console.log('Criando viagem:', { userID, date, earning, description }); // DEBUG
        const newTrip = new Trip({ userID, date, earning, description });
        await newTrip.save();
        res.status(201).json({ success: true, message: 'Viagem salva com sucesso', trip: newTrip });
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao salvar viagem', error: error.message });
    }
};

export const getTripHistory = async (req, res) => {
    try {
        const { id } = req.params;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const trips = await Trip.find({
            userID: id,
            date: {
                $gte: todayStart,
                $lte: todayEnd
            }
        }).sort({ date: -1 });
        res.status(200).json({ success: true, trips });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Erro ao obter histórico de viagens', error: error.message });
    }
}

export const getAllTrips = async (req, res) => {
    try {
        const { id } = req.params;
        const { period = 'all' } = req.query;

        let filter = { userID: id };

        if (period === 'today') {
            const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
            filter.date = { $gte: todayStart, $lte: todayEnd };
        } else if (period === 'week') {
            const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
            filter.date = { $gte: weekStart };
        } else if (period === 'month') {
            const monthStart = new Date(); monthStart.setMonth(monthStart.getMonth() - 1);
            filter.date = { $gte: monthStart };
        }

        const trips = await Trip.find(filter).sort({ date: -1 });
        res.json({ success: true, trips });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

