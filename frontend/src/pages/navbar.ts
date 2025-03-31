import { setLang, getLang } from '../i18n/language.js'; 
export class Navbar{
 
    render(){
        var lang = getLang();
        var textLang = "🇬🇧 English";
        if(lang === 'fr'){
            textLang = "🇫🇷 Français";
        }else if(lang === 'de'){
            textLang = "🇩🇪 Deutsch";
        }else if(lang === 'ar'){
            textLang = "🇹🇳 العربية";
        }else if(lang === 'ko'){
            textLang = "🇰🇷 한국어";
        }
        return `<div class="container mx-auto flex justify-between items-center">
        <a href="#" onclick="router.updatePage('welcome', true)" class="navbar-title text-2xl text-neon-blue animate-glow">MyTranscendence</a>
        <div class="flex space-x-4">
            <a href="#profile" data-page="profile" class="nav-link">Profile</a>
            <a href="#game" data-page="game" class="nav-link">Duel</a>
            <a href="#tournaments" data-page="tournaments" class="nav-link">Tournaments</a>
            <a href="#chat" data-page="chat" class="nav-link">Chat</a>
            <a href="#language" data-page="language" class="nav-link flex items-center space-x-2">
                 <span>${textLang}</span>
            </a>
        </div>
    </div>`;
    }

}