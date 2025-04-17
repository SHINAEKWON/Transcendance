export abstract class A_Page
{
    app: HTMLElement | null = document.getElementById("app");
    sidebar: HTMLElement | null = document.getElementById("sidebar");

    constructor()
    {
        
    }

    private clear(): void
    {
        if (this.app)
        {
            this.app.innerHTML = ``;
        }
    }

    load(): void
    {
        this.clear();
        this.load_page();
    }

    protected abstract load_page(): void;
    abstract leave(): void;
}