
export function passwordChecker() {
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

  if (!passwordInput || !submitButton)
    return ;

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      const pass = passwordInput.value;
  
      const checks = {
        length: pass.length >= 12 && pass.length <= 30,
        uppercase: /[A-Z]/.test(pass),
        lowercase: /[a-z]/.test(pass),
        number: /[0-9]/.test(pass),
        special: /[\W_]/.test(pass),
        repeat: !/(.)\1\1/.test(pass),
      };

      const allValid = Object.values(checks).every(v => v);
      submitButton.disabled = !allValid;
      
      if (!allValid) {
        passwordInput.setCustomValidity("Password must meet all requirements");
      } else {
        passwordInput.setCustomValidity("");
      }
      passwordInput.reportValidity();

      for (const key in checks) {
        const typedKey = key as keyof typeof checks;
        const element = document.getElementById(key);
        if (element) {
          element.innerText = `${checks[typedKey] ? "✅" : "❌"} ${element.innerText.slice(2)}`;
        }
      }
    });
  }
}
