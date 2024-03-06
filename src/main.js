window.acceptsCookies = false;
let gtagEnable = true;

if (gtagEnable) {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
        dataLayer.push(arguments);
    }

    gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
    });
}

const getAccept = () => document.cookie.indexOf('cookie-disabler=accept') !== -1;

let allowedScriptToInsert = "[SCRIPT]";

const updateCookies = () => {
    window.acceptsCookies = getAccept();

    // If a script tag with id inserted exists, delete it
    const insertedScript = document.getElementById("inserted");
    if (insertedScript) {
        insertedScript.remove();
    }

    // Fire event to window
    window.dispatchEvent(new Event('cookie-update'));

    if (getAccept()) {
        if (gtagEnable) {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted',
                'analytics_storage': 'granted'
            });
        }

        const newScript = document.createElement("script");
        newScript.innerText = allowedScriptToInsert;
        document.body.append(newScript);
    }
};

const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=Strict`;
    updateCookies();
};

// Init after window load
window.onload = () => {
    let html = `[HTML]`;
    const css = `<style>[CSS]</style>`;
    const translations = [TRANSLATIONS];
    let lang = document.documentElement.lang;
    lang = lang.split('-')[0].split('_')[0].split(',')[0];

    const translation = translations[lang] || translations['[FALLBACK_LANG]'];
    for (const key in translation) {
        html = html.replace(`[${key.toUpperCase()}]`, translation[key]);
    }

    // insert HTML at end of body
    document.body.insertAdjacentHTML('beforeend', html);
    // insert CSS at end of head
    document.head.insertAdjacentHTML('beforeend', css);

    if (document.cookie.indexOf('cookie-disabler=') === -1) {
        document.getElementById('cookie-disabler').style.display = 'block';
    }

    document.getElementById('cookie-accept').addEventListener('click', () => {
        document.getElementById('cookie-disabler').style.display = 'none';
        setCookie('cookie-disabler', 'accept', 365);
    });

    document.getElementById('cookie-refuse').addEventListener('click', () => {
        document.getElementById('cookie-disabler').style.display = 'none';
        setCookie('cookie-disabler', 'refuse', 365);
    });

    updateCookies();
};
