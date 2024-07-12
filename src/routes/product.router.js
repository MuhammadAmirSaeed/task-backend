import { Router } from 'express';
import { createProduct,getAllProducts,getProductById,deleteProduct,updateProduct} from '../controllers/product.controller.js'; 
import { upload } from '../middleware/multer.middleware.js'; 
import {AuthMiddleware} from '../middleware/auth.middleware.js' 
const router = Router();

router.route('/create-product').post( upload.array('pictures', 6), AuthMiddleware, createProduct);
export { createProduct,getAllProducts,getProductById,deleteProduct,updateProduct};
router.route('/products').get( getAllProducts);
router.route('single/:id').get( getProductById);
router.route('/delete-product/:id').delete( AuthMiddleware, deleteProduct);
router.route('/update-product/:id').put( upload.array('pictures', 6), AuthMiddleware, updateProduct);
export default router;
