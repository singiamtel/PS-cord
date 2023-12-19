export function toID(s: unknown) {
    if (typeof s === 'string') {
        return s.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    return '';
}

export function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function cleanRegex(regex: RegExp) { // Convert regex to string
    return regex.toString().slice(1, -2);
}
