import product from "../../database/Models/product.model.js";
export function paginatedResults (model){
    return async(req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if(endIndex < await model.countDocuments()){
            results.next = {
                page: page + 1,
                limit: limit
            };
        }

        if(startIndex > 0){
            results.previous = {
                page: page - 1,
                limit: limit
            };
        }

        if(model == product){
            results.products = await model.find({}).populate("category").limit(limit).skip(startIndex); 
        }else{
            results.results = await model.find({}).limit(limit).skip(startIndex);
        }
        res.paginatedResults = results;
        next();
    }
}