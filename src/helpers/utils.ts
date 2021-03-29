export function formatDateTime(utc: number) {

  let d = new Date(utc);

  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export function setDarkTheme(enabled: boolean) {
  document.body.classList.toggle("dark", enabled);
}

export function styleScrollbar(element: HTMLElement, appendStyleToParentElement: boolean = true) {

  const styles = document.createElement('style');

  styles.textContent = `
    ::-webkit-scrollbar {
      width: 5px;
    }
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-background);
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: var(--scrollbar-thumb);
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--scrollbar-thumb); 
      border-radius: 5px;
    }
    ::-webkit-scrollbar-corner {
      background: var(--scrollbar-background); 
    }
  `;

  if (appendStyleToParentElement) {

    if (element.parentElement.shadowRoot) {
      element.parentElement.shadowRoot.appendChild(styles);
    }
    else {
      element.parentElement.appendChild(styles);
    }
  }
  else {
    
    if (element.shadowRoot) {
      element.shadowRoot.appendChild(styles);
    }
    else {
      element.appendChild(styles);
    }
  }
}