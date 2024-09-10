export function generateToken() {
    const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    let token = "";
    const length = 20;
    for (let i = 0; i < length; i++) {
        token += character.charAt(Math.floor(Math.random() * character.length));
    }
    return token;
}