import WebglExperience from "@/webGL";
import { sortElementInnerText } from "../utils/chunks";
import gsap from 'gsap'
import Animals from "./world/Animals";

export default class UIAnimations {
    experience: WebglExperience;
    animals: Animals;
    elementWrapper: HTMLElement;
    styles: CSSModuleClasses;
    disable: boolean;
    currentIndex: number;
    sortedChildren!: ReturnType<typeof sortElementInnerText>[]
    constructor(experience: WebglExperience, styles: CSSModuleClasses) {
        this.experience = experience;
        this.animals = experience.world.animals;

        this.elementWrapper = document.querySelector(`[data-sec2-animate-content]`) as HTMLElement;;
        this.styles = styles;
        this.disable = false;
        this.currentIndex = 0;

        this.init()
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
        /**
         * SET UP UI TEXT ANIMATIONS
         */
        this.disable = true;
        const navWrapper = document.querySelector(`.${this.styles.animateNav}`) as HTMLElement
        const currentAciveSortedChar = document.querySelectorAll(".char-class.active");
        const newActiveSortedChar = document.querySelectorAll(`.char-class-${this.currentIndex}`);
        navWrapper.style.opacity = "0.3";


        /**
         * SET UP WEBGL ANIMATION
         */

        this.animals.activeIndex.prev = this.animals.activeIndex.latest;
        this.animals.activeIndex.latest = this.currentIndex;

        const currentDisplayedGroup: THREE.Group = this.animals.currentDisplayedSide === "head" ? this.animals.headGroup : this.animals.tailGroup;
        const currentHiddenGroup: THREE.Group = this.animals.currentDisplayedSide !== "head" ? this.animals.headGroup : this.animals.tailGroup;

        let nextActivesetUp = currentHiddenGroup.children.find(child => child.name === `set-up-${this.currentIndex}`)!;
        let prevActivesetup = currentDisplayedGroup.children.find(child => child.name === `set-up-${this.animals.activeIndex.prev}`)!;
        const inActiveSetups = currentHiddenGroup.children.filter(child => child.name !== `set-up-${this.currentIndex}`);


        this.animals.setActiveAnimalModel(nextActivesetUp!);

        inActiveSetups.forEach(model => {
            currentHiddenGroup.remove(model);
            currentDisplayedGroup.add(model);
        })


        const nextActivesetUpAnimalModel = this.animals.getSetUpAnimalModel(nextActivesetUp);
        const prevActiveSetupAnimalModel = this.animals.getSetUpAnimalModel(prevActivesetup);

        console.log(nextActivesetUpAnimalModel, prevActiveSetupAnimalModel)

        // show active
        if (nextActivesetUp) nextActivesetUp.visible = true;


        const timeline = gsap.timeline({ defaults: { duration: 10 } });

        timeline.to(
            currentAciveSortedChar,
            {
                transform: "translateY(-60px) rotate3d(1,0,0.1,90deg)",

                autoAlpha: 0,
                stagger: 0.1,
                ease: "power1.inOut",
                onComplete: () => {
                    currentAciveSortedChar.forEach(child => {
                        child.classList.remove("active")
                    })
                }
            }, "same"
        ).to(this.animals.coinGroup.position, {
            y: () => {
                let returnValue = this.animals.valueManager.tailOffset.toString()
                if (this.animals.currentDisplayedSide === "head") {
                    returnValue = `+=${this.animals.valueManager.tailOffset}`
                }

                return returnValue

            },
        }, "same+=1.5"
        ).to(this.animals.coinGroup.rotation, {
            z: `+=${Math.PI}`,
            ease: "linear",
            onComplete: () => {
                this.animals.currentDisplayedSide = this.animals.currentDisplayedSide === "head" ? "tail" : "head";
                currentDisplayedGroup.children.forEach(child => {
                    child.visible = false;
                })
            }
        }, "same+=1.5"
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