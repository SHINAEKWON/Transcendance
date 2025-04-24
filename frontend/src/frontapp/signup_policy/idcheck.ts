
export function idNumberChecker() {

    const idNumberInput = document.getElementById("idNumber") as HTMLInputElement;
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!idNumberInput)
        return ;

    if (idNumberInput) {
        idNumberInput.addEventListener("input", () => {
            const idnum = idNumberInput.value;

            const checks = {
                length: idnum.length >= 3 && idnum.length <= 20,
                regex: /^[A-Za-z0-9_.-]+$/.test(idnum),
            };

            const allValid = Object.values(checks).every(v => v);
            submitButton.disabled = !allValid;

            if (!checks.length) {
                idNumberInput.setCustomValidity("Id length must be between 3~20");
            } else if (!checks.regex) {
                idNumberInput.setCustomValidity("Can only contain alphabet, number and special characters ( _, - and .)");
            }
            idNumberInput.reportValidity();
        });
    }
}