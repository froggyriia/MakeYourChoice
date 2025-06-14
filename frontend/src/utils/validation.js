// utils/validation.js
export const isInnopolisEmail = (email) =>
    email.endsWith('@innopolis.university');

export const isAdmin = (email) =>
    email === 'admin@innopolis.university';
