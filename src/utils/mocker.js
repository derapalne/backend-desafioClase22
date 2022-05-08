import faker from "@faker-js/faker";
faker.locale = 'es';

export default class Mocker {
    constructor() {}

    generarProductos(cant) {
        const productosFake = [];
        for(let i = 0; i < cant; i++) {
            const prod = {
                title: faker.commerce.product(),
                price: Number(faker.commerce.price()),
                thumbnail: faker.image.imageUrl(64,64.,'product')
            }
            productosFake.push(prod);
        }
        return productosFake;
    }
}