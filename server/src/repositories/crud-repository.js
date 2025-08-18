



class CrudRepository{

    constructor(model){
        this.model = model
    }
    
    async create(data){
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async get(data){
        try {
            const response = await this.model.findById(data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getAll(){
        try {
            const response = await this.model.find();
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async update(id,data){
        try {
            const response = await this.model.findByIdAndUpdate(id, data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    
    async delete(data){
        try {
            const response = await this.model.deleteOne(data);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }




}

module.exports= CrudRepository;