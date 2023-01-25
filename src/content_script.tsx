import invariant from "invariant";

interface Section {
  teamName: string;
}

function addSection(sections: Map<string, Section>, element: HTMLDivElement) {
  const title = element.querySelector(".repos-pr-section-header-title span")?.textContent;
  console.log(element, title);
  invariant(title, "Section title is not found.");
  if (sections.has(title)) {
    return;
  }
  const match = title.match(/^\s*Team:\s*(.+?)\s*$/);
  if (match) {
    const section: Section = {
      teamName: match[1],
    };
    console.log("Add section", title, section)
    sections.set(title, section);
  }
}

function startObservingContainer(sections: Map<string, Section>, element: HTMLDivElement) {
  const elementObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLDivElement && node.classList.contains("repos-pr-section-card")) {
          addSection(sections, node);
        }
      });
    });
  });
  elementObserver.observe(element, { childList: true });
}

function main() {
  const [sectionsContainer] = document.querySelectorAll(".page-content")
  invariant(sectionsContainer instanceof HTMLDivElement, "Sections container is not found.");

  const sections = new Map<string, Section>();
  sectionsContainer.querySelectorAll(".repos-pr-section-card").forEach((node) => {
    if (node instanceof HTMLDivElement) {
      addSection(sections, node);
    }
  });
  startObservingContainer(sections, sectionsContainer);

  return sections;
}

const SECTIONS = main();