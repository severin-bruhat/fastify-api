import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from './modules/user/user.schema';
import { productSchemas } from './modules/product/product.schema';

const fastify = Fastify();

fastify.register(fjwt, {
    secret: process.env.JWT_SECRET || 'some-secret-key'
});

fastify.addHook('preHandler', (req, res, next) => {
    req.jwt = fastify.jwt
    return next()
});

fastify.register(fCookie, {
    secret: process.env.COOKIE_SECRET || 'some-secret-key',
    hook: 'preHandler',
});

fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
        const token = request.cookies.access_token;

        if (!token) {
            return reply.status(401).send({ message: 'Authentication required' });
        }

        const decoded = request.jwt.verify<FastifyJWT['user']>(token);
        request. user = decoded;
    }
);

fastify.get('/helloworld', async (req, res) => {
    return { message: 'Hello World!' }
})

async function main() {

    for (const schema of [...userSchemas, ...productSchemas]) {
        fastify.addSchema(schema);
    }

    fastify.register(require('@fastify/swagger'), {});
    fastify.register(require('@fastify/swagger-ui'), {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: 'Fastify Prisma REST API',
                description: 'A REST API built with Fastify, Prisma and TypeScript',
                version: '1.0.0',
                contact: {
                    name: "Vinojan Abhimanyu",
                    url: "https://vinojan.online",
                    email: "imvinojanv@gmail.com"
                },
            },
            externalDocs: {
                url: 'https://github.com/imvinojanv/fastify-prisma-rest-api',
                description: 'Fastify Tutorial source code is on GitHub',
            },
            host: '0.0.0.0:3000',
            basePath: '/',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
        uiConfig: {
            docExpansion: 'none', // expand/not all the documentations none|list|full
            deepLinking: true,
        },
        staticCSP: false,
        transformStaticCSP: (header: any) => header,
        exposeRoute: true
    });

    // Executes Swagger
    fastify.ready(err => {
        if (err) throw err
        fastify.swagger()
    })

    fastify.register(userRoutes, {prefix: 'api/users'});
    fastify.register(productRoutes, { prefix: 'api/products' }); 

    try {

        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server listening at http://localhost:3000");
        
    } catch (error) {
        console.error(error);
        process.exit(1);    // exit as failure
    }
}

main();