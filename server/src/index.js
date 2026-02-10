const express = require("express");
const cors = require("cors");
const { ServerConfig, ConnectDB, RedisConfig, Queue } = require("./config");
const { RedisStore } = require("connect-redis");
const session = require("express-session");
const apiRoutes = require("./routes");

const app = express();

app.use(
    cors({
        origin: ServerConfig.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
    try {
        await ConnectDB();
        console.log(
            `Successfully started the server on PORT : ${ServerConfig.PORT}`
        );

        // Connect Redis (graceful — won't crash if unavailable)
        const redisClient = await RedisConfig.connectRedis();

        // Set up session middleware only if Redis is available
        if (redisClient) {
            const sessionMiddleware = session({
                store: new RedisStore({ client: redisClient }),
                secret: ServerConfig.SECRET_KEY || "mysecret123",
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: false,
                    httpOnly: true,
                    maxAge: 900000,
                },
            });
            app.use(sessionMiddleware);
            console.log("Session store configured with Redis");
        } else {
            console.warn(
                "⚠️  Redis unavailable — session store not configured"
            );
        }

        // Connect RabbitMQ (graceful — won't crash if unavailable)
        await Queue.rabbitmqConnect();
    } catch (error) {
        console.error("Failed during startup:", error.message);
        process.exit(1);
    }
});