// Utility: convert string to ArrayBuffer
function strToBuffer(str) {
    return new TextEncoder().encode(str);
}

// Utility: convert ArrayBuffer to base64 string
function bufToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

// Utility: convert base64 string to ArrayBuffer
function base64ToBuf(b64) {
    return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

// Generate a cryptographic key and store it in sessionStorage (not localStorage for security!)
async function getCryptoKey() {
    let keyBase64 = sessionStorage.getItem('cryptoKey');
    if (keyBase64) {
        // Re-import the key
        let keyRaw = base64ToBuf(keyBase64);
        return await window.crypto.subtle.importKey(
            "raw",
            keyRaw,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
        );
    } else {
        // Generate and store
        let key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        let keyRaw = await window.crypto.subtle.exportKey("raw", key);
        sessionStorage.setItem('cryptoKey', bufToBase64(keyRaw));
        return key;
    }
}

// Encrypt and store data in localStorage
async function encryptAndStore(key, storageKey, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
    const encoded = strToBuffer(data);
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded
    );
    // Store base64(iv):base64(ciphertext)
    localStorage.setItem(storageKey, bufToBase64(iv) + ':' + bufToBase64(ciphertext));
}

// Load and decrypt data from localStorage
async function loadAndDecrypt(key, storageKey) {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return null;
    const [ivB64, ctB64] = stored.split(':');
    const iv = base64ToBuf(ivB64);
    const ciphertext = base64ToBuf(ctB64);
    const plaintextBuf = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
    );
    return new TextDecoder().decode(plaintextBuf);
}

// Usage example:
(async () => {
    const key = await getCryptoKey();
    const yourData = "<xml>my sensitive content</xml>";
    await encryptAndStore(key, "encryptedXML", yourData);
    // ... later ...
    const decrypted = await loadAndDecrypt(key, "encryptedXML");
    console.log("Decrypted XML:", decrypted);
})();
