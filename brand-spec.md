# Niche3D design and asset record

## Design decisions

The user requested a significant overhaul to resemble Amazon. The reference is Amazon's broad retail layout: a dark two-level navigation bar, category-scoped search, shopping-list actions, a wide promotional banner, overlapping white category panels, compact product cards, yellow actions, and a multi-column footer. The site retains its Niche3D/Niche Manufacturing identity.

- Logo: original repository asset `logo.png`; optimized display copy `assets/logo.webp`.
- Main navigation: `#131921`; secondary navigation/footer: `#232f3e`.
- Page: `#e7e9ec`; cards: white; primary text: `#0f1111`.
- Actions: `#ffd814`; search accent: `#febd69`; links: `#216a78`.
- Banner themes: warm yellow, sage, and clay, coordinated with the concept images.
- Type: Arial/Helvetica sans-serif to match the reference's compact retail typography without external font dependencies.
- Spacing: mostly 4px increments; 10–28px card gaps/padding adjusted by breakpoint.
- Corners: nearly square category/product cards, 6px form controls, pill shopping actions.
- Motion: short 150–300ms hover transitions; manually operated banner; reduced-motion support.
- Layout: four catalog columns on desktop, two on tablet and phone; mobile search on a separate header row.

## Product-image provenance

The repository originally used text-only placeholder images for its four listed models. Four replacement concept illustrations were generated with the built-in image-generation tool, then encoded as 1024px WebP files for efficient web delivery. They are explicitly labeled as illustrations in the catalog and detail dialogs. None establishes actual inventory, engineering feasibility, or a completed physical print.

Saved image paths, relative to the repository:

- `assets/gear.webp`
- `assets/dragon.webp`
- `assets/vase.webp`
- `assets/organizer.webp`

Each image used this shared final prompt, with the subject below substituted:

> Use case: product-mockup. Create one premium ecommerce concept illustration, square 1024x1024. Subject: [SUBJECT]. Clean photorealistic studio product render, matte PLA plastic with fine visible 3D print layer lines, isolated against a uniform warm off-white #f5f5f3 background. One subject centered, entirely visible with generous 12% margins. Soft grounded shadow, diffused studio lighting, three-quarter view. No text, logos, watermark, labels, hands or extraneous props. It illustrates a model concept, not a verified manufactured product.

Subjects:

- Gear: a teal 3D printed high torque planetary gearbox assembly with exposed interlocking precision gears, presented at three quarter angle.
- Dragon: a coral-orange 3D printed articulated crystal bone dragon curled into an elegant C shape, clear jointed segments and faceted crystal scales.
- Vase: a tall mustard yellow 3D printed geometric low poly sculptural vase, angular faceted body and narrow opening.
- Organizer: a muted sage green 3D printed modular workbench hexagonal organizer with several honeycomb cups of varying heights, empty.

The original brand logo was resized and encoded without creative modification. Images are bundled locally; the page has no third-party script, font, analytics, or image-host dependency.
