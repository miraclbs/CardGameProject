import { useRef, useState } from "react";

export function useCardTilt() {
    const wrapperEl = useRef(null);
    const labelEl = useRef(null);
    const cardEl = useRef(null);
    const animEl = useRef(null);
    const [showAnim, setShowAnim] = useState(false);

    const onMove = (e) => {
        const wrapper = wrapperEl.current;
        const card = cardEl.current;
        const label = labelEl.current;
        if (!wrapper || !card) return;

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        const shadowX = ((centerX - x) / centerX) * 20;
        const shadowY = ((centerY - y) / centerY) * 20;

        wrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        wrapper.style.boxShadow = `${shadowX}px ${shadowY}px 20px rgba(92, 99, 156, 0.3)`;
        label.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const onEnter = () => {
        setShowAnim(true);
        if (animEl.current) {
            animEl.current.play();
        }
    };

    const onExit = () => {
        const wrapper = wrapperEl.current;
        const label = labelEl.current;

        wrapper.style.transform = "rotateX(0deg) rotateY(0deg)";
        wrapper.style.boxShadow = "0px 5px 10px rgba(92, 99, 156, 0.3)";
        label.style.transform = "rotateX(0deg) rotateY(0deg)";
        setShowAnim(false);
        if (animEl.current) {
            animEl.current.pause();
            animEl.current.currentTime = 0;
        }
    };

    return {
        wrapperEl,
        labelEl,
        cardEl,
        animEl,
        showAnim,
        onMove,
        onEnter,
        onExit
    };
}