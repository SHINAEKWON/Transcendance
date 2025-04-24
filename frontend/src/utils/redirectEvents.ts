export class RedirectEvents {
  // ✅ Méthode statique pour attacher les événements de redirection
  static attachRedirectEvents(): void {
    setTimeout(() => {
      console.log("✅ Attachement des événements de navigation (redirect-btn)");

      document.querySelectorAll(".redirect-btn").forEach(button => {
        button.addEventListener("click", () => {
          const targetPage = (button as HTMLElement).getAttribute("data-page");

          if (targetPage) {
            console.log("📌 Clic détecté sur :", targetPage);
            window.location.hash = targetPage;
          } else {
            console.error("❌ Erreur: `data-page` non défini sur le bouton.");
          }
        });
      });
    }, 10);
  }
}
