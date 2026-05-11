import re
import os
import base64
import urllib.parse

html_file = 'index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

os.makedirs('assets/icons', exist_ok=True)

def repl(match):
    src = match.group(1)
    alt = match.group(2)
    # The src looks like data:image/svg+xml;base64,..... or data:image/svg+xml;utf8,....
    filename = alt.lower().replace(' ', '_').replace('.', '') + '.svg'
    filepath = os.path.join('assets/icons', filename)
    
    if ';base64,' in src:
        b64_data = src.split(';base64,')[1]
        try:
            svg_data = base64.b64decode(b64_data).decode('utf-8')
        except UnicodeDecodeError:
            svg_data = base64.b64decode(b64_data)
            with open(filepath, 'wb') as f:
                f.write(svg_data)
            return f'<img src="assets/icons/{filename}" alt="{alt}" class="tool-icon">'
    else:
        # maybe utf8
        svg_data = urllib.parse.unquote(src.split(',')[1])
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg_data)
        
    return f'<img src="assets/icons/{filename}" alt="{alt}" class="tool-icon">'

# Find all <img src="data:..." alt="..."> inside tool-tag span
# The structure is: <img src="data:image/svg+xml;base64,..." alt="React" class="tool-icon">
pattern = r'<img\s+src="(data:image/svg\+xml[^"]+)"\s+alt="([^"]+)"\s+class="tool-icon">'
new_content = re.sub(pattern, repl, content)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Extraction complete.")
