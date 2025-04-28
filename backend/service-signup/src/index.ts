import Fastify, {FastifyRequest, FastifyReply, FastifyInstance} from "fastify";
import { User } from "./User.js";
import dotenv from 'dotenv';

dotenv.config();

const app: FastifyInstance = Fastify ({ logger: true });

const PORT: string = process.env.PORT_SIGNUP || "";
const PATH: string = process.env.PATH_SIGNUP || "";

// Test GET
// From ChatGPT:
// When you return an object (or value) in Fastify, Fastify automatically sends 
// that object as a response to the client.
app.get ("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message : "Fastify server received your get request!" };
});

// Global error handler
app.setErrorHandler((err: Error, request: FastifyRequest, reply: FastifyReply) => {
    console.error('signup: global error occured', err);
    reply.status(500).send({ error: 'Global error has occured !' });
});

// POST to /signup
// From ChatGPT:
// With POST requests, you often need to do more processing (like user 
// registration, database interaction, etc.). You might want to set specific 
// status codes or include headers or cookies with your response.
app.post(PATH, async (request: FastifyRequest, reply: FastifyReply) => {
        
    try {
        const body: any = request.body;
        await User.registerNewUser(request, reply);
        reply.status(200).send({ success: true });
    } catch (err) { 
        console.error('/signup error occured', err);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
});

// Server launch
app.listen ({ port: parseInt(PORT), host: "0.0.0.0" }, (err: Error | null, address: string) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server is now listening at http://localhost:${PORT}`);
});
