import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import httBackground from '../htt.png'
import httThumbnail from '../httthumbnail.png'
import './styles.css'

const backgrounds = {
  intro: '/group.png',
  projects: '/group.png',
  ddv: '/ddv.png',
  dede: '/dedeback.png',
  htt: httBackground,
  experience: '/group.png',
}

const projects = [
  {
    id: 'ddv',
    title: 'DDV',
    thumbnail: '/ddvthumbnail.png',
  },
  {
    id: 'dede',
    title: 'DEDE',
    thumbnail: '/dedethumbnail.png',
  },
  {
    id: 'htt',
    title: 'HTT',
    thumbnail: httThumbnail,
  },
]

function Background({ activeSection, projectFocused }) {
  return (
    <div className={`background ${projectFocused ? 'is-project-focused' : ''}`} aria-hidden="true">
      {Object.entries(backgrounds).map(([section, image]) => (
        <div
          className={`background__image ${activeSection === section ? 'is-active' : ''}`}
          key={section}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}
      <div className="background__shade" />
    </div>
  )
}

function Project({ project, activeProject, onActivate, onDeactivate }) {
  return (
    <article
      className={`project__card ${activeProject && activeProject !== project.id ? 'is-dimmed' : ''}`}
      id={project.id}
      tabIndex="0"
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
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <dl className="metadata">
          <div>
            <dt>Date</dt>
            <dd>Lorem ipsum</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>Lorem ipsum</dd>
          </div>
          <div>
            <dt>Tech</dt>
            <dd>Lorem ipsum</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('intro')
  const [activeProject, setActiveProject] = useState(null)
  const activeBackground = activeProject ?? activeSection

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

  return (
    <>
      <Background activeSection={activeBackground} projectFocused={Boolean(activeProject)} />
      <main>
        <section className="section intro" data-section="intro">
          <div className="intro__content">
            <img className="portrait" src="/me.jpg" alt="Portrait" />
            <div className="intro__copy">
              <p className="eyebrow">Game developer portfolio</p>
              <h1>Hello.</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
            </div>
          </div>
        </section>

        <section className="projects" data-section="projects">
          <div className="section-label">Selected projects</div>
          <div className="projects__grid">
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
            <p className="eyebrow">Background</p>
            <h2>Experience &amp; Education</h2>
            <div className="experience__grid">
              <article>
                <h3>Work Experience</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </article>
              <article>
                <h3>Education</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </article>
            </div>
          </div>
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
