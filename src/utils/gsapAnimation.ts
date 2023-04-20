import { sortElementInnerText } from "./chunks";
import gsap from 'gsap'

export default class UIAnimations {
    elementWrapper: HTMLElement;
    styles: CSSModuleClasses;
    disable: boolean;
    currentIndex: number;
    sortedChildren!: ReturnType<typeof sortElementInnerText>[]
    constructor(elementWrapper: HTMLElement, styles: CSSModuleClasses) {
        this.elementWrapper = elementWrapper;
        this.styles = styles;
        this.disable = false;
        this.currentIndex = 0;
    }

    init() {
        const children = Array.from(this.elementWrapper.children) as HTMLParagraphElement[];
        this.sortedChildren = []

        children.forEach((child, i) => {
            this.sortedChildren.push(sortElementInnerText(child, `char-class char-class-${i}`, i))
        })

        const sortedChar1 = document.querySelectorAll(".char-class-1");
        const sortedChar2 = document.querySelectorAll(".char-class-2");

        gsap.to(
            [...sortedChar1, ...sortedChar2],
            {
                transform: "rotate3d(1,0,0.1,90deg)",
                duration: 0,
                autoAlpha: 0
            }
        )
    }

    animate() {
        this.disable = true;
        const navWrapper = document.querySelector(`.${this.styles.animateNav}`) as HTMLElement
        const currentAciveSortedChar = document.querySelectorAll(".char-class.active");
        const newActiveSortedChar = document.querySelectorAll(`.char-class-${this.currentIndex}`);

        navWrapper.style.opacity = "0.3"
        const timeline = gsap.timeline()

        timeline.to(
            currentAciveSortedChar,
            {
                transform: "translateY(-60px) rotate3d(1,0,0.1,90deg)",
                duration: 0.7,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "power1.inOut",
                onComplete: () => {
                    currentAciveSortedChar.forEach(child => {
                        child.classList.remove("active")
                    })
                }
            }
        ).fromTo(
            newActiveSortedChar,
            {
                transform: "translateY(60px) rotate3d(1,0,0.1,-90deg)",
            },
            {
                transform: "translateY(0px) rotate3d(1,0,0.1,0deg)",
                duration: 0.7,
                autoAlpha: 1,
                ease: "power1.inOut",
                stagger: 0.1,
                onComplete: () => {
                    newActiveSortedChar.forEach(child => {
                        child.classList.add("active");
                    })
                    this.disable = false;
                    navWrapper.style.opacity = "1"
                }
            },
        )

    }


    dispose() {
        this.sortedChildren.forEach(child => {
            child.element.innerHTML = child.baseInnerHTML
        })
    }
}