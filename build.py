import json
import os
import re
import uuid
import gzip
import cssmin
import htmlmin
import rjsmin

from parse_config import parse_config, Config

id_regex = re.compile(r'id="([\w-]+)"')  # Match all ids in the HTML content

class JsonDumpEncoder(json.JSONEncoder):
    def default(self, o):
        # If is dataclass, convert to dict
        if hasattr(o, '__dict__'):
            return o.__dict__
        return json.JSONEncoder.default(self, o)

def minify_css(css_file):
    with open(css_file, 'r') as f:
        css_content = f.read()
    minified_css = cssmin.cssmin(css_content)
    return minified_css


def minify_html(html_file):
    with open(html_file, 'r') as f:
        html_content = f.read()
    minified_html = htmlmin.minify(html_content)
    return minified_html


def replace_html_and_css(config: Config, js_file, html_file, css_file, output_file):
    minified_css = minify_css(css_file)
    html_content = minify_html(html_file)

    with open(js_file, 'r') as f:
        js_content = f.read()

    js_content = js_content.replace("[HTML]", html_content)
    js_content = js_content.replace("[CSS]", minified_css)



    js_content = js_content.replace("[COOKIES]", json.dumps(config.cookies, cls=JsonDumpEncoder))
    js_content = js_content.replace("[FALLBACK_LANG]", config.general.fallback)
    js_content = js_content.replace("[SCRIPT]", "")
    # Build the JS translation object
    translations = config.general.translations
    dumps = json.dumps(translations)
    print(dumps)
    js_content = js_content.replace("[TRANSLATIONS]", dumps)

    ids = re.findall(id_regex, html_content)
    random_prefix = str(uuid.uuid4())[0:4]
    mapping = {
        old_id: f"a{random_prefix}_{index}" for index, old_id in enumerate(ids)
    }

    for old_id, new_id in mapping.items():
        print(f"Replacing {old_id} with {new_id}")
        js_content = js_content.replace(old_id, new_id)

    with open(output_file, 'w') as f:
        f.write(rjsmin.jsmin(js_content))

    gzip_file = output_file + ".gz"
    with open(output_file, 'rb') as f_in:
        with gzip.open(gzip_file, 'wb') as f_out:
            f_out.writelines(f_in)



def main():
    css_file = 'src/style.css'  # Path to your CSS file
    js_file = 'src/main.js'  # Path to your JavaScript file
    html_file = 'src/dialog.html'  # Path to your HTML file
    output_file = 'dist/bundled.js'  # Path to your output file
    config_file = "src/config.toml"

    # Create path to output file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    config = parse_config(config_file)

    replace_html_and_css(config, js_file, html_file, css_file, output_file)




if __name__ == "__main__":
    main()
