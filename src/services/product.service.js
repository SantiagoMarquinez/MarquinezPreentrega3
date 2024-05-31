const ProductModel = require("../models/product.model");

class ProductService {
    async addProduct(productData) {
        try {
            const { title, description, price, thumbnails, code, stock, category } = productData;
            if (!title || !description || !price || !thumbnails || !code || !stock || !category) {
                throw new Error("El producto no puede tener campos vacíos");
            }

            const productExists = await ProductModel.findOne({ code });
            if (productExists) {
                throw new Error("Ya existe un producto con ese código");
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                thumbnails: thumbnails || [],
                code,
                stock,
                category,
                status: true
            });

            await newProduct.save();
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    async getProducts() {
        try {
            return await ProductModel.find().lean();
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) {
                throw new Error(`El producto con el ID ${id} no fue encontrado`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await ProductModel.findByIdAndDelete(id);
            if (!product) {
                throw new Error(`No hay productos con el ID ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
            if (!product) {
                throw new Error(`El producto con el ID ${id} no existe`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }
}


exports.paginateProducts = async (filter, options) => {
    return await ProductModel.paginate(filter, options);
};

exports.getProducts = async () => {
    return await ProductModel.find().lean();
};

module.exports = new ProductService();
