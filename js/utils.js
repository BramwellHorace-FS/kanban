class Utils {
  constructor() {}

  static disableScroll() {
    window.scrollTo(0, 0);
  }

  static preventDefault() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }
}