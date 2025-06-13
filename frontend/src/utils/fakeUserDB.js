
let users = [{email: 'admin@innopolis.university', password: 'admin'}];

export function addUser(user) {
    users.push(user);
}

export function getUsers() {
    return users;
}

export function findUser(email, password) {
    return users.find(u => u.email === email && u.password === password);
}

export function userExists(email) {
    return users.some(u => u.email === email);
}

export function isAdmin(email, password) {
    return email === "admin@innopolis.university" && password === "admin";
}
