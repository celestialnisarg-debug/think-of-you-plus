import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
const nano = customAlphabet(alphabet, 8);

export function makeSlug(): string {
  return nano();
}
