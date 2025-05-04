import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

export async function deletePreviousAvatar (newName:string, extension:string) {

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const uploadDir = path.join(__dirname, '../uploads');

    const toDelete: string[] = [];

    if (extension == "png") {
        toDelete.push(`${newName}.jpg`);
        toDelete.push(`${newName}.gif`);
    } else if (extension == "jpg") {
        toDelete.push(`${newName}.png`);
        toDelete.push(`${newName}.gif`);
    } else {
        toDelete.push(`${newName}.png`);
        toDelete.push(`${newName}.jpg`);
    }

    for (const filename of toDelete) {
        const filePath = path.join(uploadDir, filename);
        try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log (`${filename} deleted`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log("No file to delete");
                } else {
                console.error("Error deleting file:", error);
                throw error;
            }
        }
    }
}

export async function renameAvatarVolume (oldName:string, newName: string) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const uploadDir = path.join(__dirname, '../uploads');
        const oldPath = path.join(uploadDir, oldName);
        const newPath = path.join(uploadDir, newName);
        console.log("OldPath:", oldPath);
        console.log("NewPath:", newPath);
        await fs.rename(oldPath, newPath);
    } catch (error) {
        console.error("Failed to rename file: ", error);
        throw error;
    }
}
