import styles from "@/styles/app.module.scss"
import { Twitter, MusicNoteRounded, EastRounded } from '@mui/icons-material';
import { useEffect } from "react";

function App() {

  useEffect(() => {
    const sec2Content = document.querySelector(`[data-sec2-animate-content]`) as HTMLElement;

    console.log(sec2Content)

    const children = Array.from(sec2Content.children) as HTMLParagraphElement[];

    console.log(children[0].innerHTML)




    console.log(children[0])


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
