import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const backgrounds = {
  intro: '/group.png',
  projects: '/group.png',
  htt: null,
  combat: null,
  ddv: null,
  dede: '/dedeback.png',
  armor: null,
  experience: '/group.png',
}

const animatedBackgrounds = new Set(['htt', 'combat', 'ddv', 'armor'])
const backgroundFadeDuration = 900
const videoBackgrounds = {
  htt: [
    { src: '/httdemo.webm', type: 'video/webm' },
    { src: '/httdemo.mp4', type: 'video/mp4' },
  ],
  combat: [
    { src: '/ce.webm', type: 'video/webm' },
    { src: '/ce.mp4', type: 'video/mp4' },
  ],
  ddv: [
    { src: '/ddvdemo.webm', type: 'video/webm' },
    { src: '/ddvdemo.mp4', type: 'video/mp4' },
  ],
  armor: [
    { src: '/aa.webm', type: 'video/webm' },
    { src: '/aa.mp4', type: 'video/mp4' },
  ],
}

const projects = [
  {
    id: 'htt',
    title: 'How the Turntables',
    description: [
      'A rhythm game where you scratch notes as a DJ cat, featuring 5 original songs and 12 unique levels. The game has a steep learning curve, but its very rewarding once you get the hang of it!',
      'Submitted to the Juniper Dev Game Jam; ranked 1st in audio, 12th overall, and was the 4th most rated game out of 3.5k entries.'
    ],
    thumbnail: '/httthumbnail.png',
    url: 'https://dsfhdshdjtsb.itch.io/howtheturntables',
    x: '6%',
    width: '44%',
    speed: 1.18,
  },
  {
    id: 'combat',
    title: 'Combat Enchantments',
    description: [
      'A Minecraft mod that adds a variety of PvPvE enchantments. Meticulously balanced for both Vanilla+ and heavily modded gameplay.',
      'Combat Enchantments has been downloaded over 300k times across CurseForge and Modrinth, and has been featured in several Youtube videos and popular Modpacks.'
    ],
    thumbnail: '/CE.png',
    url: 'https://www.curseforge.com/minecraft/mc-mods/combat-enchantments',
    x: '54%',
    width: '40%',
    speed: 1.08,
  },
  {
    id: 'ddv',
    title: 'Dungeon Deja Vu',
    description: [
      'A puzzle platformer featuring a cyclical twist: each level loops back on itself! For this jam, I stepped out of my comfort zone and drew the assets myself.',
      'Submitted to Bevy Jam #5; ranked 3rd in game design and 8th overall out of 77 entries.'
    ],
    thumbnail: '/ddvthumbnail.png',
    url: 'https://dsfhdshdjtsb.itch.io/dungeon-deja-vu',
    x: '11%',
    width: '46%',
    speed: 0.88,
  },
  {
    id: 'dede',
    title: "Dede's Dilation Diner",
    description: [
      'A unique cooking game where you manipulate cook times by throwing food between time-dilating planets.',
      'Submitted to GMTK 2026; ranked #35th in visuals, #124th in creativity out of over 10k entries.'
    ],
    thumbnail: '/dedethumbnail.png',
    url: 'https://dsfhdshdjtsb.itch.io/dedes-dilation-diner',
    x: '57%',
    width: '42%',
    speed: 1.12,
  },
  {
    id: 'armor',
    title: 'Armor Abilities',
    description: [
      'Another Minecraft mod, this time with abilities that are activatable by button press. With up to 4 abilities available at a time, this mod drastically changes the combat flow of vanilla Minecraft.',
      'Armor Abilities has been downloaded around 40k times across CurseForge and Modrinth.'
    ],
    thumbnail: '/aathumbnail.png',
    url: 'https://www.curseforge.com/minecraft/mc-mods/armor-abilities',
    x: '5%',
    width: '43%',
    speed: 0.82,
  },
]

function BackgroundLayer({ section, image, active }) {
  const animated = animatedBackgrounds.has(section)
  const isProject = projects.some((project) => project.id === section)
  const videoSources = videoBackgrounds[section]
  const isVideo = Boolean(videoSources)
  const [loaded, setLoaded] = useState(!animated || active)
  const [ready, setReady] = useState(!isVideo)

  useEffect(() => {
    if (active) {
      setLoaded(true)
      return undefined
    }

    if (!animated || !loaded) return undefined

    const unloadTimer = window.setTimeout(
      () => {
        setLoaded(false)
        if (isVideo) setReady(false)
      },
      backgroundFadeDuration,
    )

    return () => window.clearTimeout(unloadTimer)
  }, [active, animated, isVideo, loaded])

  return (
    <div
      className={`background__image ${isProject ? 'background__image--project' : ''} ${active && ready ? 'is-active' : ''}`}
      style={{ backgroundImage: loaded && !isVideo ? `url(${image})` : 'none' }}
    >
      {loaded && isVideo && (
        <video
          autoPlay
          className="background__video"
          disablePictureInPicture
          loop
          muted
          onCanPlay={() => setReady(true)}
          playsInline
          preload="auto"
        >
          {videoSources.map(({ src, type }) => (
            <source key={src} src={src} type={type} />
          ))}
        </video>
      )}
    </div>
  )
}

function Background({ activeSection, projectFocused }) {
  return (
    <div className={`background ${projectFocused ? 'is-project-focused' : ''}`} aria-hidden="true">
      {Object.entries(backgrounds).map(([section, image]) => (
        <BackgroundLayer
          active={activeSection === section}
          image={image}
          key={section}
          section={section}
        />
      ))}
      <div className="background__shade" />
    </div>
  )
}

function Project({ project, activeProject, onActivate, onDeactivate }) {
  return (
    <a
      className={`project__card ${activeProject && activeProject !== project.id ? 'is-dimmed' : ''}`}
      href={project.url}
      id={project.id}
      data-project-card={project.id}
      data-speed={project.speed}
      style={{ '--project-x': project.x, '--project-width': project.width }}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => onActivate(project.id)}
      onMouseLeave={(event) => {
        if (!event.currentTarget.matches(':focus')) onDeactivate()
      }}
      onFocus={() => onActivate(project.id)}
      onBlur={onDeactivate}
    >
      <div className="project__image-wrap">
        <img
          className="project__image"
          src={project.thumbnail}
          alt={`${project.title} project thumbnail`}
        />
      </div>
      <div className="project__copy">
        <h2>{project.title}</h2>
        {project.description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <p className="project__link-hint"><em>Click to go to game page</em></p>
    </a>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('intro')
  const [activeProject, setActiveProject] = useState(null)
  const [scrollProject, setScrollProject] = useState(null)
  const activeBackground = scrollProject ?? activeSection

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible) setActiveSection(visible.target.dataset.section)
      },
      { rootMargin: '-25% 0px -25% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    )

    document.querySelectorAll('[data-section]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cards = [...document.querySelectorAll('[data-project-card]')]
    const field = document.querySelector('.projects__field')
    const projectsSection = document.querySelector('.projects')
    const background = document.querySelector('.background')
    const mobileQuery = window.matchMedia('(max-width: 760px)')
    let projectActivatedByScroll = false
    let frame

    const updateProjects = () => {
      frame = null
      const viewportCenter = window.innerHeight / 2
      const pageCenter = window.scrollY + viewportCenter
      const fieldTop = field.getBoundingClientRect().top + window.scrollY
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = mobileQuery.matches
      const blurEnd = Math.max(projectsSection.offsetTop - window.innerHeight * 0.35, 1)
      const blurProgress = Math.max(0, Math.min(1, window.scrollY / blurEnd))
      let nearestCard
      let nearestDistance = Infinity

      background.style.setProperty('--scroll-blur', `${3 + blurProgress * 15}px`)

      cards.forEach((card) => {
        const speed = Number(card.dataset.speed)
        const cardCenter = fieldTop + card.offsetTop + card.offsetHeight / 2
        const parallaxY = reduceMotion || isMobile
          ? 0
          : Math.max(-260, Math.min(260, (pageCenter - cardCenter) * (1 - speed)))
        const renderedCenter = cardCenter - window.scrollY + parallaxY
        const distance = Math.abs(viewportCenter - renderedCenter)

        card.style.setProperty('--parallax-y', `${parallaxY}px`)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestCard = card
        }
      })

      cards.forEach((card) => card.classList.toggle('is-centered', card === nearestCard))

      const projectsRect = projectsSection.getBoundingClientRect()
      const projectsAreCentered = projectsRect.top <= viewportCenter
        && projectsRect.bottom >= viewportCenter
      const centeredProject = projectsAreCentered && nearestCard
        ? nearestCard.dataset.projectCard
        : null

      setScrollProject(centeredProject)

      if (isMobile) {
        setActiveProject(centeredProject)
        projectActivatedByScroll = projectsAreCentered
      } else if (projectActivatedByScroll) {
        setActiveProject(null)
        projectActivatedByScroll = false
      }
    }

    const queueUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateProjects)
    }

    updateProjects()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <Background activeSection={activeBackground} projectFocused={Boolean(activeProject)} />
      <main>
        <section className="section intro" data-section="intro">
          <div className="intro__content">
            <img className="portrait" src="/me.jpg" alt="Portrait" />
            <div className="intro__copy">
              <h1>Hi, I&apos;m Nick, I make games.</h1>
              <p>I&apos;m currently a 4th year CS student at Georgia Tech, and a former Sony intern. I enjoy making and playing difficult games.</p>
              <p>
                Some of my favorite games include Dark Souls 3, Ghost of Tsushima, FTL,
                and League of Legends.
              </p>
              <p>I go by dsfhdshdjtsb online.</p>
            </div>
          </div>
        </section>

        <section className="projects" data-section="projects">
          <h2 className="projects__title">My games</h2>
          <div className="projects__field">
            {projects.map((project) => (
              <Project
                project={project}
                activeProject={activeProject}
                onActivate={setActiveProject}
                onDeactivate={() => setActiveProject(null)}
                key={project.id}
              />
            ))}
          </div>
        </section>

        <section className="section experience" data-section="experience">
          <div className="experience__content">
            <section className="background-section">
              <h2>My Background</h2>
              <h3 className="timeline__heading">Work</h3>
              <div className="timeline">
                <article className="timeline__item">
                  <p className="timeline__date">September 2026 — December 2026</p>
                  <div className="timeline__dot" aria-hidden="true" />
                  <div className="timeline__entry">
                    <h4>Cloudflare</h4>
                    <p className="timeline__title">Software Engineer Intern</p>
                  </div>
                </article>
                <article className="timeline__item">
                  <p className="timeline__date">May 2026 — August 2026</p>
                  <div className="timeline__dot" aria-hidden="true" />
                  <div className="timeline__entry">
                    <h4>Sony Interactive Entertainment</h4>
                    <p className="timeline__title">Software Engineer Intern</p>
                  </div>
                </article>
              </div>
              <h3 className="timeline__heading timeline__heading--education">Education</h3>
              <article className="timeline__item timeline__item--isolated">
                <p className="timeline__date">August 2023 — December 2027</p>
                <div className="timeline__dot" aria-hidden="true" />
                <div className="timeline__entry">
                  <h4>Georgia Institute of Technology</h4>
                  <p className="timeline__title">Bachelor of Science, Computer Science</p>
                </div>
              </article>
            </section>

            <section className="contact-section">
              <h2>Contact Me</h2>
              <p>
                You can contact me through{' '}
                <a href="https://discord.com/users/395005138000936960" target="_blank" rel="noreferrer">Discord</a>,{' '}
                <a href="mailto:nicksuh@gatech.edu">email</a>, or{' '}
                <a href="https://linkedin.com/in/nsuh" target="_blank" rel="noreferrer">LinkedIn</a>.
                <br />
                You can also view my{' '}
                <a href="https://dsfhdshdjtsb.itch.io/" target="_blank" rel="noreferrer">Itch</a>,{' '}
                <a href="https://github.com/dsfhdshdjtsb" target="_blank" rel="noreferrer">GitHub</a>, or{' '}
                <a href="/resume.pdf" target="_blank" rel="noreferrer">resume</a>.
              </p>
            </section>
          </div>
          <p className="background-credit">
            <em>
              Background image made as a{' '}
              <a href="https://sdahc.itch.io/the-group-photo" target="_blank" rel="noreferrer">
                commemoration
              </a>{' '}
              of the Juniper Dev Game Jam by its community. My contribution is the headphone cat at the bottom of the screen,
              to the right of the middle.
            </em>
          </p>
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
