import { FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../../models/user/Users.js';
import { UserStatus } from '../../models/user/Users.js';
import * as userModel from '../../db/userModel.js';

// Password validity check in Backend
export function isPasswordValid(password: string): boolean {

    const checks = {
        length: password.length >= 12 && password.length <= 30,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[\W_]/.test(password),
        repeat: !/(.)\1\1/.test(password),
      };

    const allValid = Object.values(checks).every (v => v);

    if (!allValid) return false;
    else return true;
}