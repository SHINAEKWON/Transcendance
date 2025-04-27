import { signupValidityStatus } from "./signupValidityStatus.js"
import { signupSubmitControl } from "./signupSubmitControl.js"
import * as signupRules from "./signupRules.js"

export function firstnameChecker() {
    const firstnameInput = document.getElementById("firstname") as HTMLInputElement;

    if (!firstnameInput)
        return ;

    if (firstnameInput) {
        firstnameInput.addEventListener("input", () => {
            const checks = signupRules.nameCheck(firstnameInput.value);

            if (checks) {
                firstnameInput.setCustomValidity("");
            } else {
                firstnameInput.setCustomValidity("firstname length must be between 2~20 and contain only alphabet, number and special characters ( _, - and .)");
            }
            firstnameInput.reportValidity();
        });
    }
}

export function lastnameChecker() {
    const lastnameInput = document.getElementById("lastname") as HTMLInputElement;

    if (!lastnameInput)
        return ;

    if (lastnameInput) {
        lastnameInput.addEventListener("input", () => {
            const checks = signupRules.nameCheck(lastnameInput.value);

            if (checks) {
                lastnameInput.setCustomValidity("");
            } else {
                lastnameInput.setCustomValidity("lastname length must be between 2~20 and contain only alphabet, number and special characters ( _, - and .)");
            }
            lastnameInput.reportValidity();
        });
    }
}


export function usernameChecker() {
    const usernameInput = document.getElementById("username") as HTMLInputElement;

    if (!usernameInput)
        return ;

    if (usernameInput) {
        usernameInput.addEventListener("input", () => {
            const checks = signupRules.nicknameCheck(usernameInput.value);

            if (checks) {
                usernameInput.setCustomValidity("");
            } else {
                usernameInput.setCustomValidity("Login length must be between 3~20 and contain only alphabet, number and special characters ( _, - and .)");
            }
            usernameInput.reportValidity();
        });
    }
}


export function nicknameChecker() {
    const nicknameInput = document.getElementById("nickname") as HTMLInputElement;

    if (!nicknameInput)
        return ;

    if (nicknameInput) {
        nicknameInput.addEventListener("input", () => {
            const checks = signupRules.nicknameCheck(nicknameInput.value);

            if (checks) {
                nicknameInput.setCustomValidity("");
            } else {
                nicknameInput.setCustomValidity("Nickname length must be between 3~20 and contain only alphabet, number and special characters ( _, - and .)");
            }
            nicknameInput.reportValidity();
        });
    }
}

// export function passwordChecker() {
//     const passwordInput = document.getElementById("password") as HTMLInputElement;

//     if (!passwordInput)
//         return ;

//     if (passwordInput) {
//         passwordInput.addEventListener("input", () => {
//             const checks = signupRules.passwordCheck(passwordInput.value);

//             if (checks) {
//                 passwordInput.setCustomValidity("");
//             } else {
//                 passwordInput.setCustomValidity("Password must meet all requirements");
//             }
//             passwordInput.reportValidity();
//         });
//     }
// }


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
  