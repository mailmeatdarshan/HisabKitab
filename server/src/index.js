const express = require('express');
const  cors = require( "cors");
const { ServerConfig, ConnectDB,RedisConfig,Queue} = require('./config');
const {RedisStore} = require('connect-redis')

const session = require('express-session');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const sessionMiddleware = session({
    store: new RedisStore({ client: RedisConfig }),
    secret:  'mysecret123',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 900000,
    },
});

app.use(sessionMiddleware);
app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async() => {
    await ConnectDB();
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    await Queue.rabbitmqConnect();
    console.log("Queue is up")
});