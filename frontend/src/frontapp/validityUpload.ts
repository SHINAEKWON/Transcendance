export async function validityUpload(file: File) {
    
    const VALID_TYPES = ['image/png', 'image/jpeg', 'image/gif'];
    
    if (!VALID_TYPES.includes(file.type)) {
        alert("Only JPG, PNG and GIF files are allowed");
        return false;
    }
    if (file.size >= 2097152) {
        alert("File must be smaller than 2Mb");
        return false;
    }
    return true;
}