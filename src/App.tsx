import styles from "@/styles/app.module.scss"
import { Twitter, MusicNoteRounded, EastRounded } from '@mui/icons-material';
import { MouseEvent, useEffect, useRef } from "react";
import UIAnimations from "./utils/gsapAnimation";

function App() {
  const animation = useRef<UIAnimations | null>(null);

  const handleNavClick = (e: MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-nav-index")!;

    if (!animation.current?.disable && animation.current?.currentIndex !== +index) {
      animation.current!.currentIndex = +index
      const currentActiveNav = document.querySelector(`.${styles.navActive}`);

      currentActiveNav?.classList.remove(styles.navActive);
      e.currentTarget.classList.add(styles.navActive)

      animation.current?.animate()
    }

  }
  useEffect(() => {
    const sec2Content = document.querySelector(`[data-sec2-animate-content]`) as HTMLElement;

    animation.current = new UIAnimations(sec2Content, styles);
    animation.current.init()

    return () => {
      animation.current?.dispose()
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
            <ul className={animation.current?.disable ? styles.disableNav : ""}>
              <li data-nav-index="0" onClick={handleNavClick} className={styles.navActive}></li>
              <li data-nav-index="1" onClick={handleNavClick}></li>
              <li data-nav-index="2" onClick={handleNavClick}></li>
            </ul>
          </nav>
          <section className={styles.sec2}>
            <div className={styles.sec2Content}>
              <div>
                <p>01 / 03</p>
                <p>ModelBling CGI Blender</p>
              </div>
              <div data-sec2-animate-content>
                <p>Elephant <br /> Li'l  baby</p>
                <p>Elated <br /> Giraffe</p>
                <p>Annoyed <br /> Chimp</p>
              </div>
            </div>
            <p className={styles.sec2Scroll}>Scroll</p>
          </section>
        </main>
      </div>

    </div>
  )
}

export default App
