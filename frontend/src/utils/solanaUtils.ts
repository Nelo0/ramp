export function hashToDisplayString(hash: string) {
    return hash.slice(0, 4) + "..." + hash.slice(-4);
}