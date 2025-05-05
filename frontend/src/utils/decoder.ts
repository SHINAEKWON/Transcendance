export function encodeId(id: any) {
    return btoa(id.toString());
}

export function decodeId(encoded: any) {
    try {
        return atob(encoded);
    } catch {
        return null;
    }
}
