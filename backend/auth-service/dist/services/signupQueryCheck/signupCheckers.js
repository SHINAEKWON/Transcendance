import validator from 'validator';
export const isNameValid = (name) => {
    const length = name.length >= 2 && name.length <= 20;
    const regex = /^[A-Za-z0-9_.-]+$/.test(name);
    return length && regex;
};
export const isusernameValid = (idnum) => {
    const length = idnum.length >= 3 && idnum.length <= 20;
    const regex = /^[A-Za-z0-9_.-]+$/.test(idnum);
    return length && regex;
};
export const isPasswordValid = (password) => {
    const length = password.length >= 12 && password.length <= 30;
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])(?!.*(.)\1\1).*$/.test(password);
    return length && regex;
};
export const isEmailValid = (email) => {
    return validator.isEmail(email);
};
export const isNicknameValid = (nickname) => {
    const length = nickname.length >= 3 && nickname.length <= 20;
    return length;
};
