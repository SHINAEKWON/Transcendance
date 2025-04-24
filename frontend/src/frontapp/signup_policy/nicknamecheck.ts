import xss from 'xss';

export function nicknameChecker() {

    const nicknameInput = document.getElementById("nickname") as HTMLInputElement;
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!nicknameInput)
        return ;

    if (nicknameInput) {
        nicknameInput.addEventListener("input", () => {
            const nick = nicknameInput.value;

            const checks = {
                length: nick.length >= 3 && nick.length <= 20,
                regex: /^[A-Za-z0-9_.-]+$/.test(nick),
            };

            const allValid = Object.values(checks).every(v => v);
            submitButton.disabled = !allValid;

            if (!checks.length) {
                nicknameInput.setCustomValidity("Id length must be between 3~20");
            } else if (!checks.regex) {
                nicknameInput.setCustomValidity("Can only contain alphabet, number and special characters ( _, - and .)");
            }
            nicknameInput.reportValidity();
        });
    }
}