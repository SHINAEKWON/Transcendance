import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';

export async function avatarUpload(res: FastifyReply, req: FastifyRequest) {
    console.log("from avatarUpload");

    const parts = await req.parts();
  
    for await (const part of parts) {

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const uploadDir = path.join(__dirname, '../uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive : true });
        }

        // console.log(part); // What does part look like ?
        
        const validFileTypes = ['image/jpeg', 'image/gif', 'image/png'];

        let extension: string = '';
        if (part.mimetype == 'image/jpeg') {
            extension = 'jpg';
        } else if (part.mimetype == 'image/gif') {
            extension = 'gif';
        } else if (part.mimetype == 'image/png') {
            extension = 'png';
        } else {
            throw new Error("Extension not allowed"); }
        
        console.log ('Found extension: ', extension);

        // Creating File in Our Server

        if (part.type === 'file') {
            const filename = part.filename; 
            // const fullFilename = filename + "." + extension;
            const filepath = path.join(uploadDir, filename);
            const writeStream = fs.createWriteStream(filepath);
            const filePart = part as MultipartFile;
            await part.file.pipe(writeStream);
        } else { 
            throw new Error("Failes to save the file")
        };
    }


}