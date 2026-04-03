
## 2024-05-15 - [Widget Close Button Accessibility & Visuals]
**Learning:** Icon-only close buttons often use a literal keyboard character ('x') instead of a proper symbol (like '✕' U+2715). This reduces visual quality. More critically, they often lack ARIA labels, making them invisible to screen readers, and lack `type="button"`, causing unintended form submissions if the widget is ever embedded within a form.
**Action:** Always ensure close buttons use `✕` or an SVG icon, and strictly enforce the presence of `aria-label="Fechar"` and `type="button"`.
