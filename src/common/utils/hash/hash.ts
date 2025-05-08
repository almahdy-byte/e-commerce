import * as bcrypt from 'bcrypt';

export const hash = (password: string): string => {
    try {
        const salt = Number(process.env.HASH_SALT as string);
        return bcrypt.hashSync(password, salt) as string;
    } catch (error) {
        throw new Error('Error hashing password', { cause: error });
    }
}

export const compare = (text: string, hashText: string): boolean => {
    return bcrypt.compareSync(text, hashText) as boolean;
}

