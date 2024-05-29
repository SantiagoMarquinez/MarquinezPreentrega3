const { trusted } = require("mongoose");
const CartModel = require("../models/cart.model.js");
const ProductModel = require('../models/product.model.js');

class CartManager {

    
    //obtener productos de un carrito
    async getProductsFromCart(id) {
        try {
            const cartFound = await CartModel.findById(id).populate('products.product');
            if (!cartFound) {
                return { status: false, message: `ERROR: Carrito no encontrado con ID ${id}` };
            }
    
            const productsWithDetails = cartFound.products.map(cartItem => ({
                product: cartItem.product,
                quantity: cartItem.quantity
            }));
    
            return { status: true, message: 'Carrito encontrado:', cart: productsWithDetails };
        } catch (error) {
            return { status: false, message: `LO SENTIMOS, HA OCURRIDO UN ERROR: ${error}` };
        }
    }
    




    // Crear un nuevo carrito
    async createNewCart() {
        try {
            const newCart = new CartModel({ products: [], quantity: 0 });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, product, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const productId = product._id;

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);

            console.log(productIndex)
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            console.log("Producto agregado con éxito");

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar el producto", error);
            throw error;
        }
    }


    // Obtener todos los carritos
    async getCarts() {
        try {
            const carts = await CartModel.find();
            return carts
        } catch (error) {
            console.error("Error del servidor al obtener los carritos");
            throw error;
        }
    };

    // Obtener un carrito por su ID
    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');
            console.log(`esto se imprime desde getCartById ${cart}`)
            if (!cart) {
                console.log(`No se encontró el carrito con id ${cartId}`);
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error del servidor - no se pudo obtener el carrito especificado");
            throw error;
        }
    }

    // Eliminar un producto del carrito por su ID
    async deleteProductById(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log(`Carrito ${cartId} inexistente. Verifique el ID`);
                return { success: false, message: `Carrito ${cartId} inexistente. Verifique el ID` };
            } else {
                const index = cart.products.findIndex(p => p.product.toString() === productId);
                if (index !== -1) {
                    cart.products.splice(index, 1);
                    await cart.save();
                    console.log(`Producto ${productId} eliminado del carrito ${cartId} con éxito`);
                    return { success: true, message: `Producto ${productId} eliminado del carrito ${cartId} con éxito` };
                } else {
                    console.log(`Producto ${productId} no encontrado en el carrito ${cartId}`);
                    return { success: false, message: `Producto ${productId} no encontrado en el carrito ${cartId}` };
                }
            }
        } catch (error) {
            console.error("Error del servidor", error);
            throw error;
        }
    }

    // Actualizar un carrito
    async updateCart(cartId, products) {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products: products }, { new: true });
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}`);
                return null;
            }
            console.log(`Carrito actualizado con éxito: ${cart}`);
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    }

    // Vaciar un carrito
    async clearCart(cartId) {
        const products = [];
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products: products }, { new: true });
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}`);
                return null;
            }
            console.log(`Se vacio el carrito ${cart}`);
            return cart;
        } catch (error) {
            console.error("Error al actualizar el carrito:", error);
            throw error;
        }
    }


    // Eliminar producto del carrito por id
    async deleteProductById(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                console.log(`No se encontró el carrito con ID ${cartId}`);
                return null;
            }

            const index = cart.products.findIndex(product => product._id === productId);
            if (index === -1) {
                console.log(`No se encontró el producto con ID ${productId} en el carrito`);
                return cart;
            }

            cart.products.splice(index, 1); // Elimina el producto del array 'products'

            await cart.save(); // Guarda los cambios en el carrito actualizado
            console.log(`Producto eliminado del carrito ${cart}`);
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }


}

module.exports = CartManager;
