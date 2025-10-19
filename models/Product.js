const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
    imageURL: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);








// const mongoose = require("mongoose");
//
// const productSchema = new mongoose.Schema(
//     {
//         salon: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
//         name: { type: String, required: true },
//         description: { type: String },
//         price: { type: Number, required: true },
//         stock: { type: Number, required: true },
//         category: { type: String }, // e.g. "Haircare", "Skincare"
//         imageUrl: { type: String },
//     },
//     { timestamps: true }
// );
//
// module.exports = mongoose.model("Product", productSchema);
