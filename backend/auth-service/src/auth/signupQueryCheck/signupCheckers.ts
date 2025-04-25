export const isNameValid = (name: string) => {
  const length = name.length >= 2 && name.length <= 20;
  const regex = /^[A-Za-z0-9_.-]+$/.test(name);
  return length && regex;
};

export const isIDNumberValid = (idnum: string) => {
  const length = idnum.length >= 3 && idnum.length <= 20;
  const regex = /^[A-Za-z0-9_.-]+$/.test(idnum);
  return length && regex;
};

export const isPasswordValid = (password: string) => {
  const length = password.length >= 12 && password.length <= 30;
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W])(?!.*(.)\1\1).*$/.test(password);
  return length && regex;
};

export const isNicknameValid = (nickname: string) => {
  const length = nickname.length >= 3 && nickname.length <= 20;
  return length;
};