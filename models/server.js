const express = require('express');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.usersPath = '/api/users'
        this.authPath  = '/api/auth'
        this.paths = {
            auth: '/api/auth',
            users: '/api/users',
            products: '/api/products',
            categories: '/api/categories'
        }

        //Connect Mongo DB
        this.connectDB();
        //Middlewares
        this.middlewares();
        //Routes in my app
        this.routes();
    }

    async connectDB(){
        await dbConnection();
    }
    middlewares(){
        this.app.use( express.static('public'));

        // read body
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.products, require('../routes/products'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en puerto ', this.port);
        })
    }
}

module.exports = Server;