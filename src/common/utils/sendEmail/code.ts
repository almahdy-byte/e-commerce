import { customAlphabet } from "nanoid"

          export const code = (): string => {
          const OTP = customAlphabet('0123456789', 6) as () => string;
          return OTP();
}