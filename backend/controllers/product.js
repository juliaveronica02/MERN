const Model = require("../models")
const Product = Model.product
const category = Model.category

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = {
            categories: req.body.categoryId,
            image: req.file.filename,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity
        }
        const product = await Product.create(newProduct)
        return res.status(200).send({message: "product created successfully!", product})
    } catch (error) {
        if (error.code === 11000) return res.status(200).send({message: "product already exist!"})
        return res.status(400).send({message: "unable to create product!", error})
    }
}

exports.getProduct = (req, res) => {
    Product.findAll({
        // not show column time when update (updateAt).
        include: [
            {
             // model name which we want to include.
             model: category,
             // we have to pass alias as we used while defining.
             as: 'category',
            },
           ],
      })
      .then((result)=> res.json(result))
      .catch((err)=> {throw err})
}