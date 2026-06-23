let bankingSystem;

document.addEventListener(
    "DOMContentLoaded",
    () => {

        bankingSystem =
            new SecureBankingSystem();

        displayAccounts();

        document
            .getElementById("transferForm")
            .addEventListener(
                "submit",
                handleTransferSubmit
            );

        document
            .getElementById("processForm")
            .addEventListener(
                "submit",
                handleProcessSubmit
            );
    }
);

function handleTransferSubmit(e) {

    e.preventDefault();

    const fromAccount =
        document.getElementById(
            "fromAccount"
        ).value;

    const pin =
        document.getElementById(
            "pin"
        ).value;

    const toAccount =
        document.getElementById(
            "toAccount"
        ).value;

    const amount =
        document.getElementById(
            "amount"
        ).value;

    const description =
        document.getElementById(
            "description"
        ).value;

    clearAlert(
        "transferAlert"
    );

    if (
        !bankingSystem.authenticateUser(
            fromAccount,
            pin
        )
    ) {

        showAlert(
            "transferAlert",
            "Authentication Failed",
            "error"
        );

        return;
    }

    const tx =
        bankingSystem.generateTransactionCode(
            fromAccount,
            toAccount,
            amount,
            description
        );

    document.getElementById(
        "generatedCode"
    ).textContent =
        tx.transactionCode;

    document.getElementById(
        "generatedHash"
    ).textContent =
        tx.verificationHash;

    document.getElementById(
        "transactionCodeResult"
    ).classList.remove(
        "hidden"
    );
}

function handleProcessSubmit(e) {

    e.preventDefault();

    const code =
        document.getElementById(
            "transactionCode"
        ).value.trim();

    const hash =
        document.getElementById(
            "verificationHash"
        ).value.trim();

    const result =
        bankingSystem.executeTransaction(
            code,
            hash
        );

    if (
        result.status === "success"
    ) {

        showAlert(
            "processAlert",
            "Transaction Completed",
            "success"
        );

        displayAccounts();
        displayTransactionHistory();
    }

    else {

        showAlert(
            "processAlert",
            result.message,
            "error"
        );
    }
}