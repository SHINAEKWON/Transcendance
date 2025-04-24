export function firstnameChecker() {
    const firstnameInput = document.getElementById("firstName") as HTMLInputElement;
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!firstnameInput)
        return ;

    if (firstnameInput) {
        firstnameInput.addEventListener("input", () => {
            const name = firstnameInput.value;

            const checks = {
                length: name.length >= 2 && name.length <= 20,
                regex: /^[A-Za-z0-9_.-]+$/.test(name),
            };

            const allValid = Object.values(checks).every(v => v);
            submitButton.disabled = !allValid;

            if (!checks.length) {
                firstnameInput.setCustomValidity("Firstname length must be between 2~20");
            } else if (!checks.regex) {
                firstnameInput.setCustomValidity("Can only contain alphabet, number and special characters ( _, - and .)");
            }
            firstnameInput.reportValidity();
        });
    }
}

export function lastnameChecker() {
    const lastnameInput = document.getElementById("lastName") as HTMLInputElement;
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!lastnameInput)
        return ;

    if (lastnameInput) {
        lastnameInput.addEventListener("input", () => {
            const name = lastnameInput.value;

            const checks = {
                length: name.length >= 2 && name.length <= 20,
                regex: /^[A-Za-z0-9_.-]+$/.test(name),
            };

            const allValid = Object.values(checks).every(v => v);
            submitButton.disabled = !allValid;

            if (!checks.length) {
                lastnameInput.setCustomValidity("Lastname length must be between 2~20");
            } else if (!checks.regex) {
                lastnameInput.setCustomValidity("Can only contain alphabet, number and special characters ( _, - and .)");
            }
            lastnameInput.reportValidity();
        });
    }
}
