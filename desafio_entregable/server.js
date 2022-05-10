import ArchivadorProductos from "./src/daos/archivadorDaoProductos.js";
import { optionsMariaDB } from "./options/mariaDB.js";
import ArchivadorMensajes from "./src/daos/archivadorDaoMensajes.js";
import { optionsSQLite } from "./options/SQLite3.js";
import Mocker from "./src/utils/mocker.js";
const mocker = new Mocker();

import express from "express";
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const archMensajes = new ArchivadorMensajes("chat", optionsSQLite);
archMensajes.chequearTabla();
const archProductos = new ArchivadorProductos("productos", optionsMariaDB);
archProductos.chequearTabla();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.set("views", "./public/views");
app.set("view engine", "ejs");

const inicializarProductos = () => {
    archProductos.save({
        title: "Onigiri",
        price: 200,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Onigiri-256.png",
    });

    archProductos.save({
        title: "Biological Warfare",
        price: 800000000,
        thumbnail: "https://cdn0.iconfinder.com/data/icons/infectious-pandemics-1/480/12-virus-256.png",
    });

    archProductos.save({
        title: "Eg",
        price: 120,
        thumbnail:
            "https://cdn3.iconfinder.com/data/icons/food-solid-in-the-kitchen/512/Egg_and_bacon-256.png",
    });
};

// inicializarProductos();

app.get("/", async (req, res) => {
    try {
        const productos = await archProductos.getAll();
        const mensajes = await archMensajes.read();
        res.status(200).render("productosForm", { prods: productos, mensajes: mensajes });
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get("/api/productos-test", async (req, res) => {
    try {
        const productos = mocker.generarProductos(5);
        const mensajes = await archMensajes.read();
        res.status(200).render("productosForm", { prods: productos, mensajes: mensajes });
    } catch (e) {
        res.status(500).send(e);
    }
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log("Lisstooooo ", PORT));

io.on("connection", async (socket) => {
    console.log(`Nuevo cliente conectado: ${socket.id.substring(0, 4)}`);
    socket.on("productoAgregado", async (producto) => {
        // console.log(producto);
        const respuestaApi = await archProductos.save(producto);
        console.log({ respuestaApi });
        // respuestaApi es el ID del producto, si no es un número, es un error (ver API)
        if (!respuestaApi) {
            socket.emit("productoInvalido", respuestaApi);
        } else {
            console.log(respuestaApi, "producto valido");
            io.sockets.emit("productosRefresh", await archProductos.getAll());
        }
    });

    socket.on("mensajeEnviado", async (mensaje) => {
        await archMensajes.save(mensaje);
        io.sockets.emit("chatRefresh", mensaje);
    });
});
