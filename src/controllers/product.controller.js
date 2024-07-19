import Product from '../models/product.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs"
import path from 'path';
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const userId = req.user._id;
    const uploadedImages = [];

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new ApiError(400, "No files uploaded or req.files is not an array");
    }

    for (const file of req.files) {
      const filePath = path.resolve(file.path);
      if (!fs.existsSync(filePath)) {
        throw new ApiError(400, `File not found: ${filePath}`);
      }
      const response = await uploadOnCloudinary(filePath);
      if (!response) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
      }
      uploadedImages.push(response.url);
    }
           if(uploadedImages.lenght >= 6){
      throw new ApiError(400, "You can only upload 6 images");
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
