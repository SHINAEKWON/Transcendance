
export function getTokenPayload(token: string): any | undefined {
    if (token) {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);
        return payload;
    } else {
        console.log ('No token found');
        return ;
    }
}