import product from "../../database/Models/product.model.js";
export const paginatedCategoryProducts = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if(endIndex < await product.countDocuments()){
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
    
    results.products = await product.find({category: req.params.categoryId}).populate("category").limit(limit).skip(startIndex);

    req.paginatedProducts = results;
    next();
}