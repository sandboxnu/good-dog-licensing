import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // Number of salt rounds (higher is more secure, but slower)

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
