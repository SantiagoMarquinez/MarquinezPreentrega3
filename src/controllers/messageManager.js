const MessageModel = require("../models/message.model");

class MessageManager {
    async saveMessage(user, message) {
        try {
            const newMessage = new MessageModel({ user, message });
            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.error("Error al guardar el mensaje:", error);
            throw error;
        }
    }

    async getAllMessages() {
        try {
            return await MessageModel.find();
        } catch (error) {
            console.error("Error al obtener todos los mensajes:", error);
            throw error;
        }
    }
}

module.exports = MessageManager;
