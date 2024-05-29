const ProductModel = require("../models/product.model")
// const fs = require("fs");
// const path = require("path");

// class Product {
//     constructor(title, description, price, thumbnail, code, stock, id, category) {
//         this.title = title;
//         this.description = description;
//         this.price = price;
//         this.thumbnail = thumbnail || [];
//         this.code = code;
//         this.stock = stock;
//         this.id = id;
//         this.category = category;
//         this.status = true;
//     }
// }
class ProductManager {
    // constructor() {
    //     this.products = [];
    //     this.path = "./src/models/products.json";
    //     this.id = 0;
    // }

    // async readProducts() {
    //     try {
    //         const verProductsJson = await fs.promises.readFile(this.path, "utf-8");
    //         this.products = JSON.parse(verProductsJson);
    //     } catch (error) {
    //         console.error("Error al leer los productos desde el archivo JSON:", error);
    //         throw error;
    //     }
    // }

    async addProduct({ title, description, price, thumbnails, code, stock, category }) {
        try {
            const objeto = { title, description, price, thumbnails, code, stock, category };
            console.log(objeto)
            // Valido que no haya campos vacios
            if (!title || !description || !price || !thumbnails || !code || !stock || !category) {
                console.log("El producto no puede tener campos vacíos");
                return;
            }
            // Verifico si el producto ya existe
            const productExists = await ProductModel.findOne({ code: code });
            if (productExists) {
                console.log("Ya existe un producto con ese codigo");
                return;
            }
            // Creo un nuevo producto y lo agrego
            const newProduct = new ProductModel({
                title,
                description,
                price,
                thumbnails: thumbnails || [],
                code,
                stock,
                category,
                status: true,

            });
            await newProduct.save();
            console.log("¡Producto agregado con éxito!");
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await ProductModel.find().lean();
            return products;
        } catch (error) {
            console.error("Error al obtener los productos:", error);
        }
    }

    async getProductById(id) {
        try {
            const productFound = await ProductModel.findById(id);
            if (!productFound) {
                throw new Error(`El producto con el ID ${id} no fue encontrado`);
            } else {
                await console.log(`Este es el producto solicitado:  ${productFound}`)
                return productFound;
            }
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            
            if (!deleteProduct) {
                console.log(`No hay productos con el id ${id}`);
                return null;
            }
            console.log(`Se elimino correctamente el producto con id ${id}`)
        } catch (error) {
            console.error(`Error inesperado al eliminar el producto con id ${id}`, error);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const toUpdateProduct = await ProductModel.findByIdAndUpdate(id, updatedProduct)

            if (!toUpdateProduct) {
                throw new Error(`El producto con id ${id} no existe`);
            }

            console.log("Producto actualizado");
            return toUpdateProduct;

        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

}


module.exports = ProductManager;
