import { signupValidityStatus } from "./signupValidityStatus.js"

export function signupSubmitControl() {
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    const allValid = Object.values(signupValidityStatus).every(Boolean);
    submitButton.disabled = !allValid;
}
