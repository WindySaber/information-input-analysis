export function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getCurrentYear() {
    const today = new Date();
    return today.getFullYear();
}

export function getCurrentMonth() {
    const today = new Date();
    return String(today.getMonth() + 1).padStart(2, '0');
}

export function getCurrentDay() {
    const today = new Date();
    return String(today.getDate()).padStart(2, '0');
}


