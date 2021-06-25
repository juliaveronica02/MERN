const Model = require("../models")
const Category = Model.category

exports.create = async (req, res) => {
    const dbCategory = await Category.findOne({where: {name:req.body.name}})
    if (dbCategory) return res.status(400).send("category already exist")

    try{
        const newCategory = new Category({name: req.body.name})
        const savedCategory = await Category.create(newCategory)
        return res.status(200).send({message: "Category created successfully!", category: savedCategory})
    } catch (err) {
        return res.status(400).send({error: "Category create un-successfull!", error: err})
    }
}

exports.getCategories = (req, res) => {
    Category.findAll({
        // not show column time when update (updateAt).
        attributes: {exclude: ['updatedAt']}
      })
      .then((result)=> res.json(result))
      .catch((err)=> {throw err})
}