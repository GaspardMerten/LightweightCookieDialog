const cookies = [COOKIES];
window.dataLayer = window.dataLayer || [];

function gtag() {
    dataLayer.push(arguments);
}

window.dataLayer = window.dataLayer || [];


gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 3000
});

function toggle(id) {
    const element = document.getElementById(id);
    element.checked = !element.checked;
}


function enableScript(id) {
    for (const script of document.querySelectorAll('script[data-id="' + id + '"]')) {
        const newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        if (script.src) newScript.src = script.src;
        if (script.innerHTML) newScript.innerHTML = script.innerHTML;
        if (script.async) newScript.async = script.async;
        if (script.defer) newScript.defer = script.defer;

        newScript.innerHTML = script.innerHTML;
        // Insert the new script before the old one
        script.parentNode.insertBefore(newScript, script);
        // Remove the old script
        script.remove();
    }
}

const updateCookies = () => {
        // wait for 10ms
        setTimeout(() => {
                readConsent();
                window.dispatchEvent(new Event('cookie-update'));
                for (const cookie of cookies) {
                    if (window.cookies[cookie.public_id]) {
                        if (cookie.is_ga) {
                            gtag('consent', 'update', {
                                'ad_storage': 'granted',
                                'ad_user_data': 'granted',
                                'ad_personalization': 'granted',
                                'analytics_storage': 'granted'
                            })
                        } else {
                            enableScript(cookie.public_id);
                        }
                    }
                }
            }, 10
        )
        ;
    }
;

function storeConsent() {
    // Store the window.cookies in a cookie
    let cookie = 'cookie-disabler=';
    for (const key in window.cookies) {
        cookie += `${key}|${window.cookies[key]},`;
    }
    // Remove trailing comma
    cookie = cookie.slice(0, -1);
    document.cookie = cookie + ';path=/;max-age=31536000;samesite=strict';
}

function readConsent() {
    window.cookies = {};

    for (const cookie of cookies) {
        window.cookies[cookie.public_id] = false;
    }
    // Read the cookie and set the window.cookies
    let cookie = document.cookie.split(';').find(c => c.trim().startsWith('cookie-disabler='));

    if (cookie) {
        cookie = cookie.split('=')[1].split(';')[0];
        console.log(cookie);
        const cookies = cookie.split(',');
        for (const c of cookies) {
            console.log(c);
            const [key, value] = c.split('|');
            window.cookies[key] = value === 'true';
        }
    }

}


function init() {
    console.log('init');
    let html = `[HTML]`;
    const css = `<style>[CSS]</style>`;
    const translations = [TRANSLATIONS];

    let lang = document.documentElement.lang;

    lang = lang.split('-')[0].split('_')[0].split(',')[0];

    const translation = translations[lang] || translations['[FALLBACK_LANG]'];

    for (const key in translation) {
        html = html.replace(`[${key.toUpperCase()}]`, translation[key]);
    }


    const parser = new DOMParser();
    html = parser.parseFromString(html, 'text/html').body.firstChild;


    for (const cookie of cookies) {
        let li = document.createElement('li');
        li.onclick = () => toggle(cookie.public_id);
        li.innerHTML = `<p>${cookie.name} <i>(${cookie.type_text[lang] ?? cookie.type})</i></p><div class='checkbox-wrapper-2'><input id='${cookie.public_id}' type='checkbox' disabled='disabled' checked="checked" class='sc-gJwTLC ikxBAC'></div>`;
        html.querySelector('ul').appendChild(li);
    }

    if (translation.cookies_url) {
        const link = document.createElement('a');
        link.classList.add('cookies-link');
        html.insertBefore(link, html.lastChild);
        link.href = translation.cookies_url;
        link.innerText = translation.cookies_url_name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

    }

    document.body.appendChild(html);
    document.head.insertAdjacentHTML('beforeend', css);

    if (document.cookie.indexOf('cookie-disabler=') === -1) {
        document.getElementById('cookie-disabler').style.display = 'block';
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
        document.getElementById('cookie-disabler').style.display = 'none';
        window.cookies = {
            ...window.cookies,
            ...Object.fromEntries(cookies.map(cookie => [cookie.public_id, document.getElementById(cookie.public_id).checked]))
        };
        storeConsent();
        updateCookies();
    });

    document.getElementById('cookie-refuse').addEventListener('click', () => {
        document.getElementById('cookie-disabler').style.display = 'none';
        window.cookies = {};
        storeConsent();
        updateCookies();
    });

}

updateCookies();


// Call the init function after the page has loaded
document.addEventListener('DOMContentLoaded', init);
// If the page has already loaded, call the init function
if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
    init();
}
