const CrudRepository = require("./crud-repository");
const { Expanse } = require("../models");
const mongoose = require("mongoose");

class ExpanseRepository extends CrudRepository {
    constructor() {
        super(Expanse);
    }

    async getFilterBy(data) {
        try {
            const category = await Expanse.find(data).exec();
            return category;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getTotalSummary(data) {
        try {
            const month = data.month;
            const userId = data.userId;
            const [year, mon] = month.split("-");
            const start = new Date(year, mon - 1, 1);
            const end = new Date(year, mon, 0, 23, 59, 59);

            const matchStage = {
                Date: { $gte: start, $lte: end },
            };

            if (userId) {
                matchStage.userId = new mongoose.Types.ObjectId(userId);
            }

            const total = await Expanse.aggregate([
                { $match: matchStage },
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
            ]);
            return total;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = ExpanseRepository;