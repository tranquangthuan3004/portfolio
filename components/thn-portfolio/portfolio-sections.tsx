import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { stack } from "@/data/stack";
import type { Project } from "@/data/projects";
import styles from "./site.module.css";

const serviceDescriptions: Record<string, string> = {
  "landing-pages": "Responsive pages that make a product or idea clear at a glance.",
  "portfolio-websites": "Personal sites that give projects a considered, individual presentation.",
  "web-animation": "Purposeful motion and interaction that support the interface rather than distract from it.",
};

const processSteps = [
  {
    number: "01",
    title: "Understand",
    description: "Clarify the goal, intended audience, and scope before implementation.",
  },
  {
    number: "02",
    title: "Set direction",
    description: "Establish the content hierarchy, layout, and visual language.",
  },
  {
    number: "03",
    title: "Build",
    description: "Implement the interface as responsive, reusable frontend components.",
  },
  {
    number: "04",
    title: "Review",
    description: "Check responsive behavior and interaction details, then refine the result.",
  },
];

const statusLabels: Record<Project["status"], string> = {
  live: "Live",
  archived: "Archived",
  "coming-soon": "Coming soon",
};

const frontendTools = stack.filter((item) => item.category === "frontend");
const projectTools = stack.filter(
  (item) => item.category === "tooling" || item.name === "Firebase",
);
const deliveryTools = stack.filter((item) => item.category === "deploy");

function ProjectLink({ href, children, label }: { href: string; children: string; label: string }) {
  return (
    <a className={styles.projectLink} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className={styles.visuallyHidden}> — {label} opens in a new tab</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function WorkSection({ projectIds }: { projectIds?: readonly Project["id"][] }) {
  const visibleProjects = projectIds
    ? projects.filter((project) => projectIds.includes(project.id))
    : projects;
  const entryLabel = visibleProjects.length === 1 ? "entry" : "entries";

  return (
    <section className={styles.workSection} id="work" aria-labelledby="engineering" tabIndex={-1}>
      <div className={styles.workHeading}>
        <div>
          <p className={styles.sectionEyebrow}>Work / Projects</p>
          <h2 id="engineering" tabIndex={-1}>
            Engineering <span className={styles.workAmpersand}>&amp;</span>{" "}
            <span className={styles.workEmphasis}>Experiments</span>
          </h2>
        </div>
        <p className={styles.sectionCount}>
          {String(visibleProjects.length).padStart(2, "0")} {entryLabel}
        </p>
      </div>
      <p className={styles.sectionIntro}>
        Software projects and interface explorations, with their current development status.
      </p>

      <ol className={styles.workList}>
        {visibleProjects.map((project, index) => (
          <li className={styles.workItem} data-status={project.status} key={project.id}>
            <span className={styles.workIndex} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>

            <article className={styles.projectArticle} aria-labelledby={`${project.id}-title`}>
              <div
                className={styles.projectMain}
                role="group"
                aria-label={project.title}
                tabIndex={0}
                data-thn-project-row=""
              >
                <div className={styles.projectSummary}>
                  <div className={styles.projectKicker}>
                    <span className={styles.projectStatus} data-status={project.status}>
                      {statusLabels[project.status]}
                    </span>
                    <span>{project.type}</span>
                  </div>
                  <h3 id={`${project.id}-title`}>{project.title}</h3>
                </div>

                <div className={styles.projectDetails}>
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  {project.status === "archived" && (
                    <p className={styles.projectNote}>
                      Some backend-dependent features may be limited.
                    </p>
                  )}

                  {(project.role || project.team || project.stack) && (
                    <dl className={styles.projectFacts}>
                      {project.role && (
                        <div className={styles.projectFact}>
                          <dt>Role</dt>
                          <dd>{project.role}</dd>
                        </div>
                      )}
                      {project.team && (
                        <div className={styles.projectFact}>
                          <dt>Team</dt>
                          <dd>{project.team}</dd>
                        </div>
                      )}
                      {project.stack && (
                        <div className={styles.projectFact}>
                          <dt>Stack</dt>
                          <dd>{project.stack.join(" · ")}</dd>
                        </div>
                      )}
                    </dl>
                  )}

                  <div className={styles.projectLinks}>
                    {project.preview && (
                      <ProjectLink href={project.preview} label={`${project.title} preview`}>
                        Open preview
                      </ProjectLink>
                    )}
                    {project.github && (
                      <ProjectLink href={project.github} label={`${project.title} repository`}>
                        Source repository
                      </ProjectLink>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ExpertiseSection() {
  return (
    <section className={styles.expertiseSection} id="expertise" aria-labelledby="expertise-heading" tabIndex={-1}>
      <div className={styles.expertiseLead}>
        <p className={styles.expertiseLabel}>Expertise</p>
        <h2 id="expertise-heading" data-thn-expertise-heading="">
          What I build, use &amp; <span className={styles.editorialSerif} data-thn-expertise-emphasis="">practice</span>
        </h2>
        <p className={styles.sectionIntro}>
          A software engineering approach to web applications: clear interface structure, considered
          tool choices, and careful implementation.
        </p>
      </div>

      <section className={styles.buildRegion} id="services" data-thn-motion-region aria-labelledby="build-heading">
        <div className={styles.buildInner}>
          <div className={styles.buildLead}>
            <p className={styles.panelEyebrow}>What I build</p>
            <h3 id="build-heading" className={styles.panelHeading} data-thn-capability-heading="">
              Web interfaces with a clear <span className={styles.editorialSerif}>purpose.</span>
            </h3>
          </div>
          <ul className={styles.buildList}>
            {services.map((service, index) => (
              <li className={styles.buildItem} key={service.id} data-thn-service-row="">
                <span className={styles.serviceIndex} data-thn-service-index="" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className={styles.serviceCopy} data-thn-service-copy="">
                  <h4>{service.title}</h4>
                  <p>{serviceDescriptions[service.id] ?? service.description}</p>
                </div>
                <span className={styles.serviceRule} data-thn-service-rule="" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.toolsRegion} id="stack" data-thn-motion-region aria-labelledby="tools-heading">
        <div className={styles.toolsInner}>
          <div className={styles.toolsLead}>
            <p className={styles.panelEyebrow}>Technologies</p>
            <h3 id="tools-heading" className={styles.panelHeading} data-thn-tool-heading="">
              A practical toolkit.
            </h3>
          </div>
          <dl className={styles.toolGroups}>
            <div className={styles.toolGroup} data-thn-tool-group="">
              <dt>Frontend</dt>
              <dd>{frontendTools.map((item) => item.name).join(" · ")}</dd>
            </div>
            <div className={styles.toolGroup} data-thn-tool-group="">
              <dt>Project tools</dt>
              <dd>{projectTools.map((item) => item.name).join(" · ")}</dd>
            </div>
            <div className={styles.toolGroup} data-thn-tool-group="">
              <dt>Delivery</dt>
              <dd>{deliveryTools.map((item) => item.name).join(" · ")}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={styles.processRegion} id="process" data-thn-motion-region aria-labelledby="process-heading">
        <div className={styles.processInner}>
          <div className={styles.processIntro}>
            <p className={styles.panelEyebrow}>How I work</p>
            <h3 id="process-heading" className={styles.panelHeading} data-thn-process-heading="">
              From scope to <span className={styles.editorialSerif}>refinement.</span>
            </h3>
          </div>
          <div className={styles.processSequence}>
            <span className={styles.processTrack} aria-hidden="true" />
            <span className={styles.processProgress} data-thn-process-progress="" aria-hidden="true" />
            <ol className={styles.processList}>
              {processSteps.map((step) => (
                <li className={styles.processStep} key={step.number} data-thn-process-step="">
                  <span className={styles.processNumber} data-thn-process-number="">
                    {step.number}
                  </span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </section>
  );
}

const contactLinks = [
  { label: "Email", value: "PhoenixZ3303@gmail.com", href: "mailto:PhoenixZ3303@gmail.com" },
  { label: "Phone", value: "0925 453 575", href: "tel:+84925453575" },
  { label: "GitHub", value: "tranquangthuan3004", href: "https://github.com/tranquangthuan3004" },
];

export function PortfolioContact() {
  return (
    <section
      className={styles.contactSection}
      id="contact"
      data-thn-contact-finale=""
      aria-labelledby="contact-heading"
      tabIndex={-1}
    >
      <div className={styles.contactInner}>
        <div className={styles.contactGrid}>
          <div className={styles.contactLead}>
            <h2 id="contact-heading" data-thn-contact-heading="">
              <span className={styles.contactStatementSetup} data-thn-contact-setup="">
                <span className={styles.contactStatementPhrase} data-thn-contact-phrase="opening">
                  Let&apos;s talk
                </span>{" "}
                <span className={styles.contactStatementPhrase} data-thn-contact-phrase="continuation">
                  about the
                </span>
              </span>{" "}
              <span className={styles.contactEmphasis} data-thn-contact-emphasis="">
                work.
              </span>
            </h2>
            <p data-thn-contact-copy="">
              Get in touch to discuss a software engineering role, a freelance project, or my work.
            </p>
          </div>

          <div className={styles.contactRail} data-thn-contact-rail="">
            <a className={styles.contactAction} href="mailto:PhoenixZ3303@gmail.com">
              <span>Email Tran Quang Thuan</span>
              <span className={styles.contactArrow} aria-hidden="true">↗</span>
            </a>

            <ul className={styles.contactList} aria-label="Contact details">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className={styles.contactLink}
                    href={link.href}
                    aria-label={`Contact via ${link.label}: ${link.value}`}
                    data-thn-contact-link=""
                  >
                    <span className={styles.contactLabel}>{link.label}</span>
                    <span className={styles.contactValue}>{link.value}</span>
                    <span className={styles.contactLinkArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioSections({
  projectIds,
}: {
  projectIds?: readonly Project["id"][];
} = {}) {
  return (
    <>
      <ExpertiseSection />
      <WorkSection projectIds={projectIds} />
    </>
  );
}
