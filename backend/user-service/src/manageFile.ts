import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

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