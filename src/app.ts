import Fastify from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from './modules/user/user.schema';

const fastify = Fastify();

fastify.get('/helloworld', async (req, res) => {
    return { message: 'Hello World!' }
})

async function main() {

    for (const schema of userSchemas) {         // should be add these schemas before you register your routes
        fastify.addSchema(schema);
    }

    fastify.register(userRoutes, {prefix: 'api/users'})   

    try {

        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server listening at http://localhost:3000");
        
    } catch (error) {
        console.error(error);
        process.exit(1);    // exit as failure
    }
}

main();