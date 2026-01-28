
import os
import re

def add_nonce_to_astro_files(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".astro"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Regex to find <script tags that define define:vars or src or just open, but DONT have nonce attribute
                # We look for <script ... >. 
                # We want to insert nonce={Astro.locals.nonce} inside the tag.
                
                # Pattern: <script (attributes without nonce) >
                # We want to replace with <script nonce={Astro.locals.nonce} \1 >
                
                # This is tricky because of multiple lines or variations.
                # Let's find all script tags.
                
                def replace_script(match):
                    tag = match.group(0)
                    if "nonce=" in tag:
                        return tag
                    
                    # Insert nonce as the first attribute
                    return tag.replace("<script", "<script nonce={Astro.locals.nonce}", 1)

                new_content = re.sub(r"<script[^>]*>", replace_script, content)
                
                if new_content != content:
                    print(f"Updating {filepath}")
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    count += 1
    return count

if __name__ == "__main__":
    updated = add_nonce_to_astro_files("/home/lele/usenexo/getnexo-site/src")
    print(f"Updated {updated} files.")
