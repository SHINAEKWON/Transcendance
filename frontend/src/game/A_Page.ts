export abstract class A_Page
{
    app: HTMLElement | null = document.getElementById("appGame");
    constructor()
    {
        
    }

    public clear(): void
    {
        if (this.app)
        {
            this.app.innerHTML = ``;
        }
    }

    load(params: URLSearchParams): void
    {
        this.clear();
        this.load_page(params);
    }

    protected abstract load_page(params: URLSearchParams): void;
    abstract leave(): void;
}