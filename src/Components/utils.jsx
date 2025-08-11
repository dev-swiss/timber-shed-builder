
export const decryptKey = (key) => {
    try {
        const originalJsonString = atob(key);
        const decodedJsonObject = JSON.parse(originalJsonString);
        return decodedJsonObject;
    } catch (error) {
        console.error("Error decrypting key:", error);
        return null;
    }
}
