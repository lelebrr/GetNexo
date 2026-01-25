
import re

def process_testimonials():
    # Read HTML
    with open('live_site.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extract Section
    section_start = html_content.find('<section class="testimonials-root"')
    if section_start == -1:
        print("Section not found")
        return

    # Find end of section (naive approach assuming it's closed properly and unique enough or just take until the script tag)
    # Looking at the file, the section ends before <script>
    # Let's find the closing tag.
    # It seems the section is followed by: <script>\n  (function() {
    
    # We can search for the next <script> after the section start
    script_start_tag = html_content.find('<script>', section_start)
    section_end = html_content.rfind('</section>', section_start, script_start_tag) + 10
    
    raw_html = html_content[section_start:section_end]
    
    # Extract Script
    # The script is the one immediately following the section
    script_end_tag = html_content.find('</script>', script_start_tag) + 9
    raw_script = html_content[script_start_tag:script_end_tag]

    # Clean HTML attributes
    # Remove data-astro-cid-aadlzisc
    clean_html = re.sub(r'\s*data-astro-cid-[a-z0-9]+', '', raw_html)
    
    # Clean Script - It has some data-astro-cid in logic? No, usually IDs.
    # Check if script references the cid. 
    # looking at previous output: document.querySelector('.testimonials-root'); ...
    # The script uses getElementById etc. It seems devoid of astro attributes reference, 
    # except maybe if it selects by attribute, but the code showed class/id selection.
    
    # Read CSS
    with open('live_testimonials.css', 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Clean CSS
    # Remove [data-astro-cid-aadlzisc]
    clean_css = re.sub(r'\[data-astro-cid-[a-z0-9]+\]', '', css_content)
    
    # Format CSS to be readable (optional, but good for Astro)
    # We can just put it in <style>
    
    # Construct Astro Component
    astro_component = f"""---
// Testimonials.astro - Reconstructed from live site
---

{clean_html}

{raw_script}

<style>
{clean_css}
</style>
"""

    with open('src/components/Testimonials.astro', 'w', encoding='utf-8') as f:
        f.write(astro_component)
    
    print("Successfully wrote src/components/Testimonials.astro")

if __name__ == "__main__":
    process_testimonials()
