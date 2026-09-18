# The Body Lab — website

Plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies
other than the Google Fonts stylesheet.

Design system: premium dark theme (#060708 base), Archivo for display type and
Manrope for body text, and exactly three accents — electric green (#2BFF88),
cyan (#00E5FF) and violet (#A855F7) — sampled from the LED strips in the
gym's own photographs. Glass surfaces and glows are used sparingly: the navbar
on scroll, the secondary buttons, the hours card and the lightbox chrome.

```
the-body-lab/
├── index.html          all markup + JSON-LD structured data
├── style.css           all styling
├── script.js           menu, scroll spy, reveals, gallery, lightbox
├── build-onefile.py    optional: bundles everything into one .html file
└── photos/
    ├── gym-01.webp     wide shot, coloured ceiling — used as the hero
    ├── gym-02.webp     wide floor shot
    ├── gym-03.webp     strength area
    ├── gym-04.webp     cardio / functional corner
    └── gym-05.webp     identical copy of gym-04 (your 1.png and 4.png were the same file)
```

Your five uploads were WebP images saved with a `.png` extension. They are
copied here byte-for-byte with the correct extension — nothing was recompressed
or cropped. The originals in your uploads folder are untouched.

## Running it

Open `index.html` in a browser. To serve it locally:

```
python3 -m http.server 8000
```

## Sections

Hero · About · Why train here · Facilities (bento) · Programs · Gallery ·
Reviews · Location · CTA · Footer. Every nav link, footer link and button is
wired; the gallery opens a fullscreen lightbox with arrow-key, swipe and
Escape support.

## Adding or swapping photos

The gallery is built from one array at the top of `script.js`:

```js
var PHOTOS = [
  { src: 'photos/gym-01.webp', alt: '…', caption: '…' },
  …
];
```

Add a line and the photo appears in the grid and the lightbox automatically.
Photos used in the Facilities and About sections are set directly in
`index.html`, so swap the `src` there.

## Two things to fill in

Both are marked with `TODO` comments in `index.html`:

1. **Social links** — the Instagram, Facebook and YouTube icons in the footer
   are placeholders and currently do nothing. Replace `href="#"` with real URLs.
2. **Contact** — the "Contact us" button points at your Google listing, since no
   phone number or email was supplied. Swap it for a `tel:`, `mailto:` or
   WhatsApp link when you have one.

No pricing, membership plans, review quotes, ratings or customer names appear
anywhere on the site.

## One shareable file

`build-onefile.py` inlines the CSS, JS and photos into a single HTML file you
can email or drop anywhere:

```
python3 build-onefile.py
```
"# bodylab" 
