
const Product = require('../models/productModel')
const paginate=
    
    
    async(req,res,next)=>{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 20;

        const startIndex=(page-1)*limit
        const endIndex=page*limit
        const results={}


        if(startIndex>0){
            results.previous={
                page:page-1,
                limit:limit
            }
        }
        //console.log('ethiiiiiiiiiiiiiiiiiiiii1');
        if(endIndex<(await Product.countDocuments().exec())){
            results.next={
                page:page+1,
                limit:limit
            }
        }
        //console.log('ethiiiiiiiiiiiiiiiiiiiii2');
        results.results=await Product.find().limit(limit).skip(startIndex);
        res.paginatedResults=results
        //console.log('ethiiiiiiiiiiiiiiiiiiiii');
        req.res=results
        next()
    }
  
module.exports={paginate}