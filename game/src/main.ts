import { Router } from "./Router.js";
import { PageGame } from "./PageGame.js";


// Define global router to be everywhere accessible
const router = new Router();
router.addPage("welcome", new PageGame());

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
