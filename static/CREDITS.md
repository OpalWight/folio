# Credits and licences

## Laptop mockups — `static/mockup/`

Two, one per featured card. Both were duplicated into Albert's Figma from the Community and
exported through the Figma MCP, and both are used under the Figma Community terms their
authors published them with — if this ever ships somewhere that needs a precise licence line,
check each community page and record it here.

### `studio.webp` — MacBook Pro 14 Free Mockup 01, by **Craftwork**

The photoreal space-grey machine on a plinth. The scene's yellow-green backdrop is a live
gradient in the Figma file rather than part of the render, so the laptop layer came out of the
file on its own with transparency intact — it sits on the site's own blue panel with nothing
keyed or painted out. Cropped to 16:10, resampled to 1600x1000 and encoded as WebP with alpha
(18 KB).

Its display is opaque, so here the preview lays *over* the render. The four display corners
were fitted from the render itself: least-squares lines through the left, right, top and
bottom boundaries of the lit panel, intersected, then pulled in 1% so the bezel still shows.
The vector the mockup ships for its own distort plugin does not line up with the render, so it
is not used.

### `air.webp` — Free MacBook Air M2 Frontview Mockup, by the Figma Community author of that file

The straight-on machine. The scene is a live composition rather than a flat render: a
background plate, the display, and the device layer on top of it. Only the device layer ships
— it is transparent where the display goes, so the preview lays *under* it and the bezel,
notch included, overlaps the live site. Placed back into the scene's own coordinates (the
device is drawn into a box slightly smaller than the frame), cropped to 16:10, resampled to
1600x1000 and encoded as WebP with alpha (17 KB).

Its display quad is the mockup's own `Screen` path — a shallow trapezoid, not a rectangle,
since the lid leans back a touch — pushed out 1% so the layer always reaches under the bezel.

An earlier version of this site used a third mockup, the vector "Macbook clay mockup template
v2" by Isaac N.C., recoloured to a cool grey. It was replaced by this one and is no longer
shipped; it remains in the repository's history.

## Screen content

The screenshots under `static/previews/` and the sites framed live in the project
previews are Albert Vo's own projects.

## Flower dot-field sources — `static/flowers/*.jpg`

The hero and placeholder dot fields are luminance sources, not display images: `src/lib/dots.ts`
samples each one and draws a blue dot per grid cell whose radius grows with darkness. That makes
the brief for these files narrow — a pale bloom against a much darker background, so the flower
falls out as clean white negative space and the background becomes the dense field.

All three were then put through the same finishing pass so they sit in the site's palette and
behave like `lily.jpg` in the dot field: reduced to luminance, given a soft radial lift in the
background (so the field varies in density instead of being uniformly dense, the way the lily's
gradient backdrop does), and mapped to a white-to-deep-blue duotone. The source files therefore
carry only white and blue, like everything else on the site.

All three were sourced from Wikimedia Commons and the licence was checked on each file's own
Commons page. **Every one is CC0 (Creative Commons Zero, public domain dedication) — no attribution
is required.** They are credited below anyway, because the photographers deserve it.

| File | Flower | Commons file | Licence |
| --- | --- | --- | --- |
| `static/flowers/rose.jpg` | Rose, `Rosa` 'Iris Gee' | [`File:Iris Gee Rose. (23828010202).jpg`](https://commons.wikimedia.org/wiki/File:Iris_Gee_Rose._(23828010202).jpg) | CC0 |
| `static/flowers/tulip.jpg` | Tulip, unidentified `Tulipa` cultivar | [`File:Tulips-56423 1920.jpg`](https://commons.wikimedia.org/wiki/File:Tulips-56423_1920.jpg) | CC0 |
| `static/flowers/forget-me-not.jpg` | Chatham Island forget-me-not, `Myosotidium hortensia` | [`File:Chatham Island forget-me-nots (Myosotidium hortensia).jpg`](https://commons.wikimedia.org/wiki/File:Chatham_Island_forget-me-nots_(Myosotidium_hortensia).jpg) | CC0 |

### `rose.jpg`

Creamy-buff rose against dark foliage. Photographed by **Bernard Spragg. NZ**, Christchurch, New
Zealand, 2015, released CC0. Original 4000x2954.

Processing: cropped to a 1.583:1 landscape frame (matching `lily.jpg`), resampled to 1100 px wide,
and a tone curve applied to sink the green foliage to near-black while holding the petals bright.
Saved as JPEG at quality 4.

### `tulip.jpg`

Three sunlit white-and-red streaked tulips against a dark background. Photographed by
**Andreas Hensel**, 2012; published on Pixabay and mirrored to Commons under CC0.
Original 1920x1275.

Processing: cropped to 1.583:1, trimming stray lit grass along the bottom edge, resampled to
1100 px wide, and a tone curve applied to deepen the background. Saved as JPEG at quality 4.

### `forget-me-not.jpg`

A tight head of blue forget-me-nots against near-black glossy leaves. Photographed by
**Bernard Spragg, NZ**, 2014, released CC0. Original 2400x1546.

This is `Myosotidium hortensia`, the Chatham Island forget-me-not — a New Zealand endemic that
carries the common name but is not a true `Myosotis`. It was chosen over the true forget-me-nots
available under CC0 because it is the only one that gives a tight, landscape-framed cluster with
enough luminance separation to survive the dot screen; the small *Myosotis* candidates all sat in
grass that reads at the same luminance as the flower.

Processing: cropped to 1.583:1, resampled to 1100 px wide, and a tone curve applied to deepen the
leaves behind the flower head. Saved as JPEG at quality 5.

### Why these and not others

Candidates were rejected when the bloom's luminance sat too close to the background's — a pink or
red rose on green leaves collapses into an unreadable blob once it is reduced to dot radii,
however good the photograph is. Each finalist was rendered through a stand-in for `dots.ts` and
checked as a dot field before being accepted.
