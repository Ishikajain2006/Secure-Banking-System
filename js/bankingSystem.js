class SecureBankingSystem {

    constructor() {
        this.accounts = structuredClone(ACCOUNTS);
        this.transactionLog = [];
    }

    authenticateUser(accountNumber, pin) {

        return (
            this.accounts[accountNumber] &&
            this.accounts[accountNumber].pin === pin
        );
    }

    generateId() {

        return (
            "TXN" +
            Date.now().toString(36).toUpperCase() +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()
        );
    }

    generateTransactionCode(
        fromAccount,
        toAccount,
        amount,
        description = ""
    ) {

        amount = Number(amount);

        if (
            !this.accounts[fromAccount]
        ) {
            throw new Error(
                "Source account not found"
            );
        }

        if (
            !this.accounts[toAccount]
        ) {
            throw new Error(
                "Destination account not found"
            );
        }

        if (
            amount <= 0 ||
            isNaN(amount)
        ) {
            throw new Error(
                "Invalid amount"
            );
        }

        const transactionData = {

            transactionId:
                this.generateId(),

            fromAccount,

            toAccount,

            amount,

            description,

            timestamp:
                Date.now(),

            expiry:
                Date.now() +
                10 * 60 * 1000
        };

        const transactionCode =
            EncryptionService.encrypt(
                transactionData
            );

        const verificationHash =
            EncryptionService.hash(
                transactionCode
            );

        return {
            transactionCode,
            verificationHash,
            transactionId:
                transactionData.transactionId
        };
    }

    decryptTransactionCode(
        transactionCode,
        verificationHash
    ) {

        try {

            transactionCode =
                transactionCode.trim();

            verificationHash =
                verificationHash.trim();

            const expectedHash =
                EncryptionService.hash(
                    transactionCode
                );

            if (
                expectedHash !==
                verificationHash
            ) {
                return {
                    status: "error",
                    message:
                        "Verification failed"
                };
            }

            const transactionData =
                EncryptionService.decrypt(
                    transactionCode
                );

            if (
                Date.now() >
                transactionData.expiry
            ) {
                return {
                    status: "error",
                    message:
                        "Transaction code expired"
                };
            }

            return {
                status: "success",
                data: transactionData
            };

        } catch (error) {

            return {
                status: "error",
                message:
                    error.message
            };
        }
    }

    executeTransaction(
        transactionCode,
        verificationHash
    ) {

        const result =
            this.decryptTransactionCode(
                transactionCode,
                verificationHash
            );

        if (
            result.status !==
            "success"
        ) {
            return result;
        }

        const tx =
            result.data;

        if (
            !this.accounts[
                tx.fromAccount
            ]
        ) {
            return {
                status: "error",
                message:
                    "Source account not found"
            };
        }

        if (
            !this.accounts[
                tx.toAccount
            ]
        ) {
            return {
                status: "error",
                message:
                    "Destination account not found"
            };
        }

        if (
            this.accounts[
                tx.fromAccount
            ].balance < tx.amount
        ) {
            return {
                status: "error",
                message:
                    "Insufficient funds"
            };
        }

        this.accounts[
            tx.fromAccount
        ].balance -= tx.amount;

        this.accounts[
            tx.toAccount
        ].balance += tx.amount;

        const transaction = {

            transactionId:
                tx.transactionId,

            fromAccount:
                tx.fromAccount,

            toAccount:
                tx.toAccount,

            amount:
                tx.amount,

            description:
                tx.description,

            timestamp:
                new Date().toISOString(),

            status:
                "completed"
        };

        this.transactionLog.push(
            transaction
        );

        return {
            status: "success",
            transactionId:
                tx.transactionId,
            message:
                "Transaction completed successfully"
        };
    }

    getAccounts() {
        return this.accounts;
    }

    getTransactionHistory() {
        return this.transactionLog;
    }
}