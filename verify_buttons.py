import os
import sys

files_to_check = [
    'getnexo-site/src/components/ProductCard.astro',
    'getnexo-site/src/components/modals/ChatModal.astro',
    'getnexo-site/src/components/modals/DemoModal.astro',
    'getnexo-site/src/components/modals/InteractiveModal.astro'
]

errors = []

for file_path in files_to_check:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # ProductCard specific checks
    if 'ProductCard' in file_path:
        if 'aria-label="Anterior"' not in content or 'type="button"' not in content or 'class="prev absolute' not in content:
            errors.append(f"{file_path} is missing prev button aria-label or type")
        if 'aria-label="Próximo"' not in content or 'type="button"' not in content or 'class="next absolute' not in content:
            errors.append(f"{file_path} is missing next button aria-label or type")
        if content.count('aria-label="Fechar"') < 2 or content.count('&#x2715;') < 2 or content.count('type="button"') < 4:
            errors.append(f"{file_path} is missing modal close aria-label, type, or X entity")
        if content.count('focus-visible:ring-2 focus-visible:outline-none rounded') < 4:
            errors.append(f"{file_path} is missing keyboard focus styles")

    # Modals checks
    else:
        if 'aria-label="Fechar"' not in content:
            errors.append(f"{file_path} is missing aria-label='Fechar'")
        if 'type="button"' not in content:
            errors.append(f"{file_path} is missing type='button'")
        if '&#x2715;' not in content:
            errors.append(f"{file_path} is missing X entity &#x2715;")
        if 'focus-visible:ring-2 focus-visible:outline-none rounded' not in content:
            errors.append(f"{file_path} is missing keyboard focus styles")

if errors:
    print("Verification failed with the following errors:")
    for error in errors:
        print(f" - {error}")
    sys.exit(1)
else:
    print("All checks passed successfully!")
