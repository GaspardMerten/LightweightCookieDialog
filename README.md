# Lightweight Cookie Dialog

## Description

This is a lightweight cookie dialog that can be used to ask for user consent to use cookies on a website. It is a simple
and easy to use solution that can be easily integrated into any website.

## Usage

Change the configuration file "src/config.toml" to your needs.

### Google Analytics / Google Tag Manager

The cookie dialog is compatible with GTAG consent mode. There are no additional steps required to make it work with GTAG
consent mode.
Just make sure the script tag for GTAG is placed after the cookie dialog script tag.

### Facebook Pixel

The cookie dialog is compatible with Facebook Pixel. Simplify modifiy your Facebook Pixel code as follow:

```html
<!-- Facebook Pixel Code -->
<script nonce="S5z5wcPN">
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s)
    }(window,
            document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', 'GTM_ID');
    fbq('consent', 'revoke');
    fbq('set', 'agent', 'tmgoogletagmanager', 'GTM_ID');
    fbq('track', "PageView");
    window.addEventListener('cookie-update', function (e) {
        fbq('consent', window.acceptsCookies ? 'grant' : 'revoke')
    }, !1)
</script>
<!-- End Facebook Pixel Code -->
```

Also make sure to remove the noscript tag from the Facebook Pixel code, as it is not supported by the cookie dialog.

### Other tracking scripts

As of now, the cookie dialog is not compatible with other tracking scripts. However, it is possible to modify the
tracking scripts to make them compatible with the cookie dialog. This can be done by adding an event listener to the "
cookie-update" event and calling the tracking script's consent method accordingly, and reading the "acceptsCookies"
property to check if the user has accepted cookies.

### Generating the output

To generate the output, install the dependencies and run the build script:

```bash
python3 -m pip install -r requirements.txt
python3 build.py
```

The output will be generated in the "dist" directory. You can now add the script to your website.

```html
<script src="cookie-dialog.js"></script>
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
