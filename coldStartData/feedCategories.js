const CategoryModel = require('./../models/category');
const categories = [
    {    name:'Commercial - Office'},
    {    name:'Commercial - Land'},
    {    name:'Commercial - Hotel'},
    {    name:'Commercial - Others'},
    {    name:'Residential - Flat'},
    {    name:'Residential - Bungalow'},
    {    name:'Residential - Row House'},
    {    name:'Residential - Plot'},
    {    name:'Residential - Others'},
    {    name:'Agriculture - Land'},
    {    name:'Others - Others'},
]

async function loadCategory(){
    let existsCategories = await CategoryModel.findOne();
    if(!existsCategories){
        try{
            let result =await CategoryModel.insertMany(categories) 
            console.log("Data inserted",result)  // Success 

        }catch(err){
            console.log(err)      // Failure 
        }
    }
}

loadCategory();