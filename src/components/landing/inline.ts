// Inline Markdown in frontmatter text, for the components that render it
// (landing/PhaseTools.astro, landing/HandOver.astro): `code` and
// [label](/path/ or https URL), nothing else. The text is escaped first, so
// it cannot carry markup of its own. External links open in a new tab.
const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }
const escape = (text: string) => text.replace(/[&<>"]/g, (c) => ESCAPES[c])

const LINK = /\[([^\]]+)\]\(((?:\/|#|https:\/\/)[^)\s]*)\)/g

/** HTML for set:html. Code spans are taken out first, so a link inside one stays text. */
export function inline(text: string): string {
  return escape(text)
    .split(/(`[^`]+`)/)
    .map((part, i) =>
      i % 2
        ? `<code>${part.slice(1, -1)}</code>`
        : part.replace(LINK, (_, label: string, href: string) =>
            href.startsWith("https:")
              ? `<a href="${href}" target="_blank" rel="noopener">${label}</a>`
              : `<a href="${href}">${label}</a>`,
          ),
    )
    .join("")
}
