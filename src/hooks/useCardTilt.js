import { useRef } from "react";

export function useCardTilt() {
    const wrapperEl = useRef(null);
    const labelEl = useRef(null);
    const cardEl = useRef(null);

    const onMove = (e) => {
        const wrapper = wrapperEl.current;
        const card = cardEl.current;
        const label = labelEl.current;

        if (!wrapper || !card || !label) return;

        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((mouseY - centerY) / centerY) * -15;
        const rotateY = ((mouseX - centerX) / centerX) * 15;

        const shadowX = ((centerX - mouseX) / centerX) * 10;
        const shadowY = ((centerY - mouseY) / centerY) * 10;

        wrapper.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
        wrapper.style.boxShadow = shadowX + "px " + shadowY + "px 20px rgba(92, 99, 156, 0.3)";
        label.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
    };

    const onExit = () => {
        const wrapper = wrapperEl.current;
        const label = labelEl.current;

        if (!wrapper || !label) return;

        wrapper.style.transform = "rotateX(0deg) rotateY(0deg)";
        wrapper.style.boxShadow = "0px 5px 10px rgba(92, 99, 156, 0.3)";
        label.style.transform = "rotateX(0deg) rotateY(0deg)";
    };

    return {
        wrapperEl,
        labelEl,
        cardEl,
        onMove,
        onExit
    };
}
