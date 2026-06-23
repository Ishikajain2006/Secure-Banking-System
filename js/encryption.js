class EncryptionService {

    static MASTER_KEY = "BANK_SECURE_KEY_2024";

    static encrypt(data) {

        try {

            const jsonData =
                JSON.stringify(data);

            return btoa(
                jsonData +
                "|" +
                this.MASTER_KEY
            );

        } catch (error) {

            throw new Error(
                "Encryption failed"
            );
        }
    }

    static decrypt(encryptedData) {

        try {

            const decoded =
                atob(encryptedData);

            const parts =
                decoded.split("|");

            if (
                parts.length !== 2 ||
                parts[1] !== this.MASTER_KEY
            ) {
                throw new Error(
                    "Invalid Key"
                );
            }

            return JSON.parse(
                parts[0]
            );

        } catch (error) {

            throw new Error(
                "Invalid transaction code"
            );
        }
    }

    static hash(data) {

        let hash = 0;

        const str =
            data +
            this.MASTER_KEY;

        for (
            let i = 0;
            i < str.length;
            i++
        ) {

            hash =
                ((hash << 5) - hash) +
                str.charCodeAt(i);

            hash |= 0;
        }

        return Math.abs(hash)
            .toString(16)
            .padStart(8, "0");
    }
}