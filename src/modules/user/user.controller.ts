import { FastifyReply, FastifyRequest } from "fastify";

import { CreateUserInput } from "./user.schema";
import { createUser } from "./user.service";

export async function registerUserHandler(
    request: FastifyRequest<{
        Body: CreateUserInput;
    }>, 
    reply: FastifyReply
) {
    const body = request.body;

    try {
        const user = await createUser(body);
        return reply.status(201).send(user);
        
    } catch (error) {
        console.error(error);
        reply.status(500).send({
            message: "Internal Server Error",
            error: error
        });
    }
}