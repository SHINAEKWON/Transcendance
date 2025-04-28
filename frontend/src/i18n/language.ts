export function getLang(): string {
    return localStorage.getItem("lang") || "en"
  }
  
  export function setLang(lang: string): void {
    localStorage.setItem("lang", lang)
  }

  