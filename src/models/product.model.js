import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { 
    type: String,
     required: true,
      minlength: 3 },
  price: {
     type: Number,
      required: true 
    },
  quantity: {
     type: Number, 
    required: true
 },
  pictures: { type: [String],
     required: true 
    },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

});

const Product = mongoose.model('Product', productSchema);

export default Product;