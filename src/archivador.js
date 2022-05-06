const knex = require("knex");

class Archivador {
    constructor(tableName, config) {
        this.tableName = tableName;
        this.knex = knex(config);
    }

    async save(data) {
        if (this.check(data)) {
            this.knex(this.tableName)
                .insert(data)
                .then(() => {
                    console.log("Guardado! =>", data);
                })
                .catch((e) => console.log(e))
                return 1;
                //.finally(() => this.knex.destroy());
        } else {
            console.log(data, "Error");
            return "error";
        }
    }
}

module.exports = Archivador;