import { Router } from "./routing/Router.js";
import { PageGame } from "./pages/PageGame.js";
import { PageWelcome } from "./pages/PageWelcome.js";
import { PageGuest } from "./pages/PageGuest.js";
import { PageSignup } from "./pages/PageSignup.js";


// Define global router to be everywhere accessible
const router = new Router();
router.addPage("game", new PageGame());
router.addPage("welcome", new PageWelcome());
router.addPage("guest", new PageGuest());
router.addPage("signup", new PageSignup());

function run_when_content_loaded(): void
{
    router.init();
}

/*
https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
The DOMContentLoaded event fires when the HTML document has been completely 
parsed, and all deferred scripts (<script defer src="…"> and 
<script type="module">) have downloaded and executed.
*/
document.addEventListener("DOMContentLoaded", run_when_content_loaded);
