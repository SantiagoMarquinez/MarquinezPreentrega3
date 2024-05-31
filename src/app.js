
const express = require("express");
const session = require("express-session");
const expresshandlebars = require("express-handlebars");
const socket = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const MongoStore = require('connect-mongo');
const configObject = require("./config/config.js");
const program = require("./utils/commander.js");


const { puerto, session_secret, mongo_url} = configObject;
require("./database.js"); // Conexión con la base de datos: esto hace la conexión con database.js y data base.js hace la conexión con mongodb


const MessageModel = require("./models/message.model.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require('./routes/session.router.js'); 

const app = express();


// Middleware
app.use(express.static("./src/public"));
//con estas dos lineas el servidor express puede interpretar mensajes de tipo json en formato urlencoded que recibira de postman
app.use(express.json());
app.use(express.urlencoded({ extended: true }));// extended true indica que trabajamos con datos complejos  (no solo strings)


// Configuración de sesiones
app.use(session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongo_url,
        ttl: 1 * 24 * 60 * 60  // Tiempo de vida de la sesión en segundos (1 dia en este caso)
    })
}));

// Configuración de cookies
app.use(cookieParser());


// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Middleware global para logs
app.use((req, res, next) => {
    console.log('Usuario autenticado (global):', req.user);
    next();
});

// Configuración de handlebars
const hbs = expresshandlebars.create({// esto es para que me permita renderizar los campos de user (configura opciones para el motor de vistas)
    defaultLayout: 'main', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('handlebars', hbs.engine); // aca en vez de usar expresshandlebars.engine, usamos la constante hbs, que es la que tiene la configuracion de las opciones del motor
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use('/api/sessions', sessionRouter);
app.use("/", viewsRouter);

const httpserver = app.listen(puerto, () => {
    console.log(`Esta aplicación funciona en el puerto ${puerto} `);
});

const io = socket(httpserver);

// Manejo de eventos de chat
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async (data) => {
        // Guarda el mensaje en MongoDB
        await MessageModel.create(data);

        // Obtiene los mensajes de MongoDB y se los pasa al cliente
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    });
});



// Manejo de eventos de productos
const productService = require("./services/product.service.js");

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    // Envía array de productos al cliente
    socket.emit("products", await productService.getProducts());

    // Recibe el evento deleteProduct desde el cliente
    socket.on("removeProduct", async (id) => {
        await productService.deleteProduct(id);
        // Envía el array de productos actualizados
        socket.emit("products", await productService.getProducts());
    });

    // Recibe el evento addProduct desde el cliente
    socket.on("addProduct", async (product) => {
        await productService.addProduct(product);
        // Envía el array de productos actualizados
        socket.emit("products", await productService.getProducts());
    });
});


// Manejo de eventos de carrito
const CartManager = require("./controllers/cartManager.js");
const cartManager = new CartManager();

io.on("connection", async (socket) => {
    console.log("Un cliente conectado");

    // Envía los datos del carrito al cliente cuando se conecta
    socket.emit("cart", await cartManager.getProductsFromCart());
});

