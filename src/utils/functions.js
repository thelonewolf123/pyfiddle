export async function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
}

export function removeObserver(obj) {
    return JSON.parse(JSON.stringify(obj))
}