# Niche3D storefront

A responsive, Amazon-inspired catalog for Niche3D, built with static HTML, CSS, and vanilla JavaScript. The existing Niche Manufacturing logo and four original model names are retained.

## Run locally

Serve this directory with any static HTTP server, for example:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. There is no package installation or build step. Vercel can serve the repository directly using its existing static-site configuration.

## Features

- Search by model name, category, or description, including shareable `?q=` searches.
- Category filters, alphabetical sorting, and no-results states.
- Model detail dialogs and saved prints.
- Print-request basket with quantity controls and custom project notes.
- Plain-text request downloads and clipboard export.
- Browser-local persistence, with validation of stored IDs and quantities.
- Responsive layouts, semantic controls, keyboard focus restoration, native modal focus trapping, reduced-motion support, and accessible status announcements.

## Content and commerce

The catalog contains the four concepts from the original page. The generated product images are illustrative; they are not photographs of verified inventory. Pricing, stock, dimensions, material specifications, production capacity, reviews, model-file downloads, and shipping promises are not invented.

Requests and saved prints are stored on the visitor's device, using `niche3d.request.v1` and `niche3d.saved.v1` in localStorage. There is no account service, payment processor, submission endpoint, or file-upload service. Downloading or copying a request does **not** send it to the company. The interface states this explicitly. A visitor shares the resulting brief through their existing contact channel.

To add actual ordering later, supply approved product specifications, prices, business contact details, and the preferred commerce/submission service.

## Editing

- `index.html`: layout, navigation, dialogs, and page metadata.
- `styles.css`: visual system and responsive breakpoints.
- `app.js`: catalog entries, search, requests, saved designs, and banner slides.
- `assets/*.webp`: optimized concept illustrations and logo.
- `logo.png`: original brand asset, preserved unchanged.
- `brand-spec.md`: design direction and image-generation provenance.

## Validation

The redesign was checked in a real browser at 320, 390, 768, and 1440 pixel widths, with no horizontal document overflow. Browser checks covered searching, category filtering, alphabetical sorting, literal rendering of HTML-like search text, saved designs, details, quantities, request removal, empty states, custom notes, persistence after reload, and exported request content. The request download was read back to verify the selected design, quantity, and notes. Clipboard export produced success feedback in the browser. JavaScript syntax and Git whitespace checks passed. No runtime errors were observed on the redesigned local page.
