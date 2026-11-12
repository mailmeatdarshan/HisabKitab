const CrudRepository = require('./crud-repository');
const { User } = require('../models');

class UserRepository extends CrudRepository {
    constructor() {
        super(User);
    }

    async getUserByEmail(data) {
        try {
            const email = await User.findOne({ email: data }).exec();
            return email;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserByUsername(data) {
        try {
            const user = await User.findOne({ username: data }).exec();
            return user;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = UserRepository;