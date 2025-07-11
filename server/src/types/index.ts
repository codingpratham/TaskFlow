import zod from 'zod';

const registerSchema = zod.object({
    name: zod.string().min(1, 'Name is required'),
    email: zod.string().email('Invalid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
    role: zod.enum(['USER', 'TEAM_ADMIN']),
});

const loginSchema = zod.object({
    email: zod.string().email('Invalid email address'),
    password: zod.string().min(6, 'Password must be at least 6 characters long'),
})

export default {
    registerSchema,
    loginSchema
};
