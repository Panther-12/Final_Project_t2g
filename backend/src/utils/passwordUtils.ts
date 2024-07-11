import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

/**
 * Hashes a password using bcrypt.
 * @param {string} password - Password to hash.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Generates a random password reset code using uuid and shortens to 6 characters.
 * @returns {string} Randomly generated password reset code.
 */
export const generatePasswordResetCode = (): string => {
  const uuid = uuidv4();
  const shortCode = uuid.substr(0, 6); // Take the first 6 characters of the uuid
  return shortCode;
};
