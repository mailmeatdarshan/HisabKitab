const CrudRepository = require('./crud-repository');
const {Expanse} = require('../models');
class ExpanseRepository extends CrudRepository {   
    constructor(){
        super(Expanse);
    }
    async getFilterBy(data){
        try {
            const category = await Expanse.find(data).exec();
            return category;
        } catch (error) {
            console.log(error);
        }
    }

    async getTotalSummary(data){
        try {
            const month = data.month;
            const [year, mon] = month.split('-');
            const start = new Date(year, mon - 1, 1);
            const end = new Date(year, mon, 0, 23, 59, 59);
            const total = await Expanse.aggregate([
                { $match: { Date: { $gte: start, $lte: end } } },
                { $group: { _id: '$category', total: { $sum: '$amount' } } }
            ]);
            return total;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}


module.exports=ExpanseRepository;