import 'client-only';

export function getWindowSize(): [number, number] {
    return [window.innerWidth, window.innerHeight];
}