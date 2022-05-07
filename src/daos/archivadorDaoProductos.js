import Archivador from '../contenedor/contenedorArchivador.js';

export default class ArchivadorProductos extends Archivador {
    constructor(tableName, config) {
        super(tableName, config);
    }

    async getAll() {
        let prods;
        await this.knex(this.tableName)
            .select("*")
            .then((productos) => {
                // Si trato de retornar los datos desde acá, no llegan al servidor;
                prods = productos;
            })
            .catch((e) => console.log(e))
            .finally(() => this.knex.destroy);
        return prods;
    }

    async getById(id) {
        await this.knex(this.tableName)
            .where({ id: id })
            .select("*")
            .then((producto) => {
                return producto;
            })
            .catch((e) => console.log(e))
            .finally(() => this.knex.destroy);
    }

    async setById(id, producto) {
        if (this.check(producto)) {
            await this.knex(this.tableName)
                .where({ id: id })
                .update({
                    title: producto.title,
                    price: producto.price,
                    thumbnail: producto.thumbnail,
                })
                .then(() => console.log("Producto modificado"))
                .catch((e) => console.log(e))
                .finally(() => this.knex.destroy);
        } else {
            console.log("Producto inválido.");
        }
    }

    async deleteById(id) {
        await this.knex(this.tableName)
            .where({ id: id })
            .del()
            .then(() => console.log("Producto borrado"))
            .catch((e) => console.log(e))
            .finally(() => this.knex.destroy());
    }

    async chequearTabla() {
        this.knex.schema.hasTable(this.tableName).then((exists) => {
            if (!exists) {
                this.knex.schema
                    .createTable(this.tableName, (table) => {
                        table.increments("id");
                        table.string("title");
                        table.float("price");
                        table.string("thumbnail");
                    })
                    .then(() => console.log("Tabla Creada:", this.tableName))
                    .catch((e) => console.log(e));
                //.finally(() => this.knex.destroy());
            } else {
                console.log("Tabla Productos existente.");
            }
        });
    }

    check(producto) {
        if (!producto.title) {
            return false;
        }
        if (!producto.price) {
            return false;
        } else {
            const price = Number(producto.price);
            if (isNaN(price)) {
                return false;
            }
        }
        if (!producto.thumbnail) {
            return false;
        }
        return true;
    }
}
