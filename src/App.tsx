import styles from "@/styles/app.module.scss"
import { Twitter, MusicNoteRounded, EastRounded } from '@mui/icons-material';
import React, { useEffect, useRef } from "react";
import WebglExperience from "./webGL";

function App() {
  const webGlExperience = useRef<WebglExperience | null>(null);

  const handleNavClick = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-nav-index")!;
    const isNotCurrentlyAnimating = !webGlExperience.current?.uiAnimation.disable && webGlExperience.current?.uiAnimation.currentIndex !== +index

    if (isNotCurrentlyAnimating) {
      const nextActiveEl = e.currentTarget as HTMLElement;
      handleAnimation(+index, nextActiveEl)
    }

  }

  const handleAnimation = (index: number, nextActiveNav: HTMLElement) => {
    webGlExperience.current!.uiAnimation!.currentIndex = +index;
    const currentActiveNav = document.querySelector(`.${styles.navActive}`);

    currentActiveNav?.classList.remove(styles.navActive);
    nextActiveNav.classList.add(styles.navActive)

    webGlExperience.current?.uiAnimation.animate()
  }


  useEffect(() => {
    const wheelCallback = (e: WheelEvent) => {
      if (!webGlExperience.current?.uiAnimation.disable) {
        const currentIndex = +webGlExperience.current?.uiAnimation.currentIndex!;
        let nextIndex = 0;
        if (e.deltaY > 0) {
          nextIndex = (currentIndex + 1) % 3
        } else {
          nextIndex = (currentIndex - 1) % 3;
          if (nextIndex < 0) nextIndex = 2;
        }

        const nextActiveEl = document.querySelector(`[data-nav-index="${nextIndex}"]`) as HTMLElement

        handleAnimation(nextIndex, nextActiveEl)
      }
    }

    window.addEventListener("wheel", wheelCallback);

    return () => window.removeEventListener("wheel", wheelCallback);
  }, [])

  useEffect(() => {
    webGlExperience.current = new WebglExperience(styles);
    return () => {
      webGlExperience.current?.dispose()
    }

  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p>Bruno <br /> Orstunland</p>
            <span />
            <p className={styles.headerLinks}>Contact</p>
          </div>
          <p className={styles.headerLinks}>About</p>
          <div>
            <MusicNoteRounded />
            <Twitter />
          </div>
        </header>
        <main>
          <section className={styles.sec1}>
            <div>
              <p>3d artist & cg supervisor <br /> at @cube_prod</p>
              <EastRounded />
            </div>
            <p>cgi blender <br /> nuke and sculpt!</p>
          </section>
          <nav className={styles.animateNav}>
            <ul className={webGlExperience.current?.uiAnimation.disable ? styles.disableNav : ""}>
              <li data-nav-index="0" onClick={handleNavClick} className={styles.navActive}></li>
              <li data-nav-index="1" onClick={handleNavClick}></li>
              <li data-nav-index="2" onClick={handleNavClick}></li>
            </ul>
          </nav>
          <section className={styles.sec2}>
            <div className={styles.sec2Content}>
              <div className={styles.sec2ContentDate}>
                <p>01 / 03</p>
                <p>ModelBling CGI Blender</p>
              </div>
              <div data-sec2-animate-content>
                <p>Elephant <br /> Li'l  baby</p>
                <p>Elated <br /> Crocs</p>
                <p>Annoyed <br /> Chimp</p>
              </div>
            </div>
            <div className={styles.sec2ScrollWrapper}>
              <p className={styles.sec2Scroll}>Scroll</p>
            </div>
          </section>
        </main>
        <canvas className={styles.webGlCanvas} data-webgl_canvas />
      </div>

    </div>
  )
}

export default App
