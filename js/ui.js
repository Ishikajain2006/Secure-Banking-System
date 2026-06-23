function showAlert(
    containerId,
    message,
    type
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;
}

function clearAlert(
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;

    container.innerHTML = "";
}

function displayAccounts() {

    const accountsList =
        document.getElementById(
            "accountsList"
        );

    if (!accountsList) return;

    accountsList.innerHTML = "";

    const accounts =
        bankingSystem.getAccounts();

    Object.entries(accounts)
        .forEach(
            ([accountNumber, details]) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "account-card";

                card.innerHTML = `
                    <div class="account-number">
                        Account: ${accountNumber}
                    </div>

                    <div class="account-name">
                        ${details.name}
                    </div>

                    <div class="account-balance">
                        ₹${Number(details.balance).toFixed(2)}
                    </div>

                    <div class="account-type">
                        ${details.accountType}
                    </div>
                `;

                accountsList.appendChild(
                    card
                );
            }
        );
}

function displayTransactionHistory() {

    const container =
        document.getElementById(
            "transactionHistory"
        );

    if (!container) return;

    const history =
        bankingSystem.getTransactionHistory();

    if (history.length === 0) {

        container.innerHTML = `
            <div class="alert alert-info">
                No transactions recorded yet.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    history
        .slice()
        .reverse()
        .forEach(tx => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "transaction-item";

            item.innerHTML = `
                <div class="transaction-header">
                    <div class="transaction-id">
                        ID: ${tx.transactionId}
                    </div>

                    <div class="transaction-amount">
                        ₹${Number(tx.amount).toFixed(2)}
                    </div>
                </div>

                <div>
                    From: ${tx.fromAccount}
                </div>

                <div>
                    To: ${tx.toAccount}
                </div>

                <div>
                    Status: ${tx.status}
                </div>

                <div>
                    ${new Date(tx.timestamp)
                        .toLocaleString()}
                </div>
            `;

            container.appendChild(
                item
            );
        });
}

function showSection(sectionId) {

    document
        .querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    const clickedButton =
        document.querySelector(
            `[onclick="showSection('${sectionId}')"]`
        );

    if (clickedButton) {
        clickedButton.classList.add("active");
    }
}
