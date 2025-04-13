export abstract class A_Page
{
    app: HTMLElement | null = document.getElementById("app");
    sidebar: HTMLElement | null = document.getElementById("sidebar");

    clear(): void
    {
        if (this.app)
        {
            this.app.innerHTML = ``;
        }
    }

    abstract load(): void;
    abstract leave(): void;
}