const {model, Schema} = require('mongoose');

const ProductSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    product_id:{
        type: String,
        required: [true, 'Product id is required'],
        unique: true
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    stock: {
        type: Boolean,
        default: true
    }
});

ProductSchema.methods.toJSON = function(){
    const { __v, product_id, state, ...data} = this.toObject();
    data.id = product_id;
    return data
}
module.exports = model('Product', ProductSchema);