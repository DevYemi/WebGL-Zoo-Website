import WebglExperience from "@/webGL";
import { sortElementInnerText } from "../utils/chunks";
import gsap from 'gsap'
import Animals from "./world/Animals";
import Environment from "./world/Environment";
import Camera from "./utils/Camera";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase)

export default class UIAnimations {
    experience: WebglExperience;
    camera: Camera;
    animals: Animals;
    environment: Environment;
    elementWrapper: HTMLElement;
    styles: CSSModuleClasses;
    disable: boolean;
    currentIndex: number;
    sortedChildren!: ReturnType<typeof sortElementInnerText>[]
    constructor(experience: WebglExperience, styles: CSSModuleClasses) {
        this.experience = experience;
        this.camera = experience.camera;
        this.animals = experience.world.animals;
        this.environment = experience.world.environment;

        this.elementWrapper = document.querySelector(`[data-sec2-animate-content]`) as HTMLElement;;
        this.styles = styles;
        this.disable = true;
        this.currentIndex = 0;

        this.setUpFlipText();
        this.setUpUI()

    }

    setUpFlipText() {
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

    setUpUI() {
        const headerWrapper = document.querySelector(`.${this.styles.header}`);
        const sec1 = document.querySelector(`.${this.styles.sec1}`)!;
        const sec2ContentDate = document.querySelector(`.${this.styles.sec2ContentDate}`)
        const rotatedElWrapper = document.querySelector(`.${this.styles.sec2ScrollWrapper}`);

        const tl = gsap.timeline({ defaults: { duration: 0.7 } });

        tl.to(
            headerWrapper,
            {
                translateY: 0,
                duration: 1
            },
        ).to(
            sec1.children,
            {
                translateX: 0
            }
        ).to(
            this.elementWrapper,
            {
                opacity: 1,
                duration: 2
            },
            "bottomSame"
        ).to(
            sec2ContentDate,
            {
                translateY: 0,
                opacity: 1
            },
            "bottomSame"
        ).to(
            rotatedElWrapper,
            {
                scale: 1,
                duration: 1,
                onComplete: () => { this.disable = false; }
            },

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

        const outgoingDisplayedGroup: THREE.Group = this.animals.currentDisplayedSide === "head" ? this.animals.headGroup : this.animals.tailGroup;
        const incomingDisplayedGroup: THREE.Group = this.animals.currentDisplayedSide !== "head" ? this.animals.headGroup : this.animals.tailGroup;

        let nextActivesetUp = incomingDisplayedGroup.children.find(child => child.name === `set-up-${this.currentIndex}`)!;
        let prevActivesetup = outgoingDisplayedGroup.children.find(child => child.name === `set-up-${this.animals.activeIndex.prev}`)!;
        const inActiveSetups = incomingDisplayedGroup.children.filter(child => child.name !== `set-up-${this.currentIndex}`);


        this.animals.setActiveAnimalModelBox(nextActivesetUp!);

        inActiveSetups.forEach(setUp => {
            incomingDisplayedGroup.remove(setUp);
            outgoingDisplayedGroup.add(setUp);
        })


        const nextActivesetUpAnimalModelBox = this.animals.getSetUpAnimalModelBox(nextActivesetUp);
        const prevActiveSetupAnimalModelBox = this.animals.getSetUpAnimalModelBox(prevActivesetup);
        this.animals.activeSetUpAnimalModel = this.animals.getSetUpAnimalModel(nextActivesetUpAnimalModelBox);

        // show active
        if (nextActivesetUp) nextActivesetUp.visible = true;



        const timeline = gsap.timeline({ defaults: { duration: 2 } });


        CustomEase.create("coinFlipEase", "M0,0 C0,0 0.072,0.321 0.166,0.57 0.225,0.727 0.314,0.848 0.33,0.864 0.361,0.897 0.39,0.918 0.43,0.939 0.468,0.96 0.5,0.97 0.545,0.98 0.599,0.992 0.636,0.994 0.695,0.997 0.812,1.002 1,1 1,1 ");

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
            }, "same"
        ).to(this.animals.coinGroup.position, {
            y: () => {
                let returnValue = this.animals.valueManager.tailOffset.toString()
                if (this.animals.currentDisplayedSide === "head") {
                    returnValue = `+=${this.animals.valueManager.tailOffset}`
                }

                return returnValue

            },
            ease: "coinFlipEase",
            duration: 3
        }, "same+=0.5"
        ).to(this.animals.coinGroup.rotation, {
            z: `+=${Math.PI}`,
            ease: "coinFlipEase",
            duration: 3
        }, "same+=0.5"
        ).to([nextActivesetUpAnimalModelBox.rotation, prevActiveSetupAnimalModelBox.rotation], {
            y: `+=${Math.PI}`,
            ease: "coinFlipEase",
            duration: 3,
            onComplete: () => {
                this.animals.currentDisplayedSide = this.animals.currentDisplayedSide === "head" ? "tail" : "head";

                outgoingDisplayedGroup.children.forEach(child => {
                    child.visible = false;
                })
            }
        }, "same+=0.5"
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
            }, "same+=2"
        )

    }


    dispose() {
        this.sortedChildren.forEach(child => {
            child.element.innerHTML = child.baseInnerHTML
        })
    }
}