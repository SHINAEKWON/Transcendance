// Global variable that takes validity of each query in signup.ts

export const signupValidityStatus: Record<string, boolean> = {
    firstName: false,
    lastName: false,
    username: false,
    nickname: false,
    password: false,
};