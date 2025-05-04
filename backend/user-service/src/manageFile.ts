import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

export async function deletePreviousAvatar (newName:string, extension:string) {
    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const uploadDir = path.join(__dirname, '../uploads');
        let filePath1 = "";
        let filePath2 = "";

        if (extension == "png") {
            filePath1 = path.join(uploadDir, newName) + ".jpg";
            filePath2 = path.join(uploadDir, newName) + ".gif";
            await fs.access(filePath1);
            await fs.access(filePath2);
            await fs.unlink(filePath1);
            await fs.unlink(filePath2);

        } else if (extension == "jpg") {
            filePath1 = path.join(uploadDir, newName) + ".png";
            filePath2 = path.join(uploadDir, newName) + ".gif";
            await fs.access(filePath1);
            await fs.access(filePath2);
            await fs.unlink(filePath1);
            await fs.unlink(filePath2);

        } else {
            filePath1 = path.join(uploadDir, newName) + ".jpg";
            filePath2 = path.join(uploadDir, newName) + ".png";
            await fs.access(filePath1);
            await fs.access(filePath2);
            await fs.unlink(filePath1);
            await fs.unlink(filePath2);
        }

    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.log("No file to delete");
          } else {
            console.error("Error deleting file:", error);
            throw error;
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
