import { getUserByEmail, getUserByUsername, getUserByTelephone } from './userModel.js';

export async function checkUserUniqueness({
  username,
  email,
  telephone
}: {
  username: string;
  email: string;
  telephone?: string | null;
}) {
  const errors: Record<string, string> = {};

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    errors.username = "Ce nom d'utilisateur est déjà pris.";
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    errors.email = "Cet email est déjà utilisé.";
  }

  if (telephone) {
    const existingTelephone = await getUserByTelephone(telephone);
    if (existingTelephone) {
      errors.telephone = "Ce numéro de téléphone est déjà utilisé.";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
