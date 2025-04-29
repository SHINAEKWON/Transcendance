import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { fileErrorCode } from './fileErrorCode.js';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function avatarUpload(res: FastifyReply, req: FastifyRequest): Promise<number> {
    console.log("from avatarUpload");

    const parts = req.parts();

    for await (const part of parts) {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive : true });
        }

        console.log(part); // What does part look like ?

        const validFileTypes = ['image/jpeg', 'image/gif', 'image/png'];

        if (!validFileTypes.includes(part.mimetype)) {
            return fileErrorCode.MIMETYPE_ERROR;
        }

        // Creating File in Our Server

        const filename = `testUploadedAvatar.${part.mimetype}`;
        const filepath = path.join(uploadDir, filename);

        const writeStream = fs.createWriteStream(filepath);
        await part.file.pipe(writeStream);

        // IMPORTANT //
        // Ici mise a jour de DB ? Faire une autre app au lieu de tout traiter ici ?
    }
    return fileErrorCode.SUCCESS;
}