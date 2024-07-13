import Product from '../models/product.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const userId = req.user._id;
    const uploadedImages = [];

    if (Array.isArray(req?.files)) {
      for (const file of req.files) {
        const response = await uploadOnCloudinary(file.path);
        if (response) uploadedImages.push(response.url);
      }
    } else {
      // Handle the case where req.files is undefined or not an array
      console.error('No files uploaded or req.files is not an array');
    }

    if (uploadedImages.length === 0) {
      throw new ApiError(500, "Something went wrong while uploading images");
    }

    const newProduct = new Product({
      name,
      price,
      quantity,
      pictures: uploadedImages,
      userId
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(
      new ApiResponse(200, savedProduct, "Product created successfully")
    );

  } catch (error) {
    console.error('Error creating product:', error); // Log the error details

  
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

   
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  return res.status(200).json(
    new ApiResponse(200, products, "Products retrieved successfully")
  );
});

// Get Product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product retrieved successfully")
  );
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const uploadedImages = [];
  for (const file of req.files) {
    const response = await uploadOnCloudinary(file.path);
    if (response) uploadedImages.push(response.url);
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading images");
  }

  product.name = name || product.name;
  product.price = price || product.price;
  product.quantity = quantity || product.quantity;
  product.pictures = uploadedImages.length ? uploadedImages : product.pictures;

  const updatedProduct = await product.save();
  return res.status(200).json(
    new ApiResponse(200, updatedProduct, "Product updated successfully")
  );
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  await product.remove();
  return res.status(200).json(
    new ApiResponse(200, null, "Product deleted successfully")
  );
});
export { createProduct,getAllProducts,getProductById,deleteProduct,updateProduct};
