import 'client-only';
import {MutableRefObject, useEffect, useState} from "react";

export function getWindowSize(): [number, number] {
    return [window.innerWidth, window.innerHeight];
}

export function useVisible(ref: MutableRefObject<any>): boolean {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setVisible(entry.isIntersecting))
        });

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); }
    }, [ref]);

    return isVisible;
}