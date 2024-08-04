import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

async function productRoutes(fastify: FastifyInstance) {
    fastify.post(
        '/',
        {
            preHandler: [fastify.authenticate],
            schema: {
                body: $ref('createProductSchema'),
                response: {
                    201: $ref('productResponseSchema'),
                }
            }
        },
        createProductHandler
    );
    fastify.get(            // public API endpoint
        '/',
        {
            schema: {
                response: {
                    201: $ref("productsResponseSchema")
                }
            }
        },
        getProductsHandler
    );
};

export default productRoutes;