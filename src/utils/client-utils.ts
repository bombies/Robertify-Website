import 'client-only';
import {MutableRefObject, useEffect, useState} from "react";

export function getWindowSize(): [number, number] {
    return [window.innerWidth, window.innerHeight];
}

export function useVisible(ref: MutableRefObject<any>): boolean {
    const [isVisible, setVisible] = useState(true);

    useEffect(() => {
        const curRef = ref.current;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setVisible(entry.isIntersecting))
        });

        if (curRef) observer.observe(curRef);
        return () => { if (curRef) observer.unobserve(curRef); }
    }, [ref]);

    return isVisible;
}