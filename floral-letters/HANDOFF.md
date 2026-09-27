# Handoff: create two Etsy draft listings (September Aster)

For the Claude session that can write to Etsy. Everything you need is in this file and
in the folder next to it. **Create drafts only. Do not publish** — the owner publishes after checking.

## What the product is

A birth-flower alphabet: all 26 letters (A–Z), each made of watercolour-style asters
(September's birth flower), sold as a **digital download** of print-ready JPGs.
Buyers print the letters of a baby's name as a baby-shower banner, then frame the first letter
for the nursery. Two colourways, **each its own listing** (Etsy can't send different files per variation):

1. **Pink & Lilac** (girl)
2. **Dusty Blue** (boy)

## Where the files are

Branch `claude/floral-letter-printables-2b2a9v` of `bogdb/sleepalign`:

- Folder: https://github.com/bogdb/sleepalign/tree/claude/floral-letter-printables-2b2a9v/floral-letters/etsy-ready/september-aster
- Listing copy (source of truth for the text): https://github.com/bogdb/sleepalign/blob/claude/floral-letter-printables-2b2a9v/floral-letters/listings/september-aster.txt

Easiest: `git clone -b claude/floral-letter-printables-2b2a9v https://github.com/bogdb/sleepalign`
then use `floral-letters/etsy-ready/september-aster/`.

```
etsy-ready/september-aster/
  pink-lilac/
    files/   September-Aster-Pink-Lilac_1of5_5x7-and-banner.zip   (13 MB)
             September-Aster-Pink-Lilac_2of5_8x10.zip             (14 MB)
             September-Aster-Pink-Lilac_3of5_11x14.zip            (13 MB)
             September-Aster-Pink-Lilac_4of5_A4.zip               (14 MB)
             September-Aster-Pink-Lilac_5of5_A3.zip               (14 MB)
    images/  01-hero-banner.jpg 02-the-print.jpg 03-a-to-z.jpg
             04-sizes.jpg 05-detail.jpg 06-colours.jpg             (3000x2250)
  dusty-blue/
    files/   September-Aster-Dusty-Blue_1of5 … 5of5 (same five sizes)
    images/  same six names
```

Each zip is under Etsy's 20 MB per-file limit and contains a START-HERE printing guide PDF.

## Listing settings (both listings)

| Field | Value |
|---|---|
| Shop | Sumikiri, `shop_id 67393012` |
| Section | **Birth Flower Letters** (create it if it doesn't exist) |
| Type | Digital (`type: download`) |
| Taxonomy | **2078** (prints / printables) |
| Who made | `i_did` |
| What is it | finished product (`is_supply: false`) |
| When made | `2020_2026` |
| Price | **8.99 EUR**, VAT-exclusive |
| Quantity | 999 |
| Materials | digital download, JPG, PDF printing guide |
| State | **draft** |

**Files:** upload all 5 zips of that colourway, in order 1of5 → 5of5.
**Images:** upload in rank order 01 → 06. Image 01 is the thumbnail.

## Title

- Pink & Lilac:
  `September Birth Flower Letter Print, Aster Floral Alphabet A-Z, Nursery Wall Art, Baby Shower Name Banner, Pink Lilac Printable`
- Dusty Blue:
  `September Birth Flower Letter Print, Aster Floral Alphabet A-Z, Nursery Wall Art, Baby Shower Name Banner, Dusty Blue Printable`

## Tags (13, all under 20 characters)

Pink & Lilac:
`birth flower letter, floral letter print, nursery letter art, september birth, aster print, floral alphabet, baby shower banner, name banner, baby girl nursery, initial wall art, printable letter, new baby gift, pastel nursery`

Dusty Blue: same list, but `baby girl nursery` → `baby boy nursery` and `pastel nursery` → `blue nursery decor`.

## Description

Copy it **exactly** from `listings/september-aster.txt` (the block between DESCRIPTION and PRE-FLIGHT CHECK).
Plain text, CAPS headings — Etsy doesn't render markdown.
For Dusty Blue, change one phrase: `soft pink and lilac asters` → `dusty blue and periwinkle asters`.

Keep the disclosure line as written (the owner approved it):
> This is an original digital design, not a copy of anyone else's artwork. I designed it with the help of AI and digital tools.

## Rules — why the shop is careful

On 17 Aug 2026 Etsy's system removed a Sumikiri draft within minutes for its category and wording. So:

- **Draft only. Never publish.**
- Don't change the category away from 2078. Never use 890 (Video Games).
- No brand names anywhere.
- Don't invent claims: not "hand-painted", no personalisation, no physical item.
- Don't change the shop title, announcement or policies.
- Price stays at 8.99 for the first 30 days (EU Omnibus rule on "was" prices) — no sale.
- If a step fails, stop and report; don't create duplicates. A half-made draft must be reported so the owner can delete it by hand.

## When done, report back

For each listing: listing_id, draft URL, number of files attached (should be 5), number of images (should be 6),
and anything that didn't go through.

## Second batch: November Chrysanthemum (same process, two more drafts)

Identical settings, rules and report-back as above, with these differences:

| | Dusty Pink | Rust & Cream (gender-neutral) |
|---|---|---|
| Files | `etsy-ready/november-chrysanthemum/dusty-pink/files/` (5 zips) | `etsy-ready/november-chrysanthemum/rust-cream/files/` (5 zips) |
| Images | `…/dusty-pink/images/` 01 → 06 | `…/rust-cream/images/` 01 → 06 |
| Title, tags, description | `listings/november-chrysanthemum.txt` | same file, with the swaps it lists |

Listing copy: https://github.com/bogdb/sleepalign/blob/claude/floral-letter-printables-2b2a9v/floral-letters/listings/november-chrysanthemum.txt

November is the priority if you only do one batch: those babies' showers are happening now.
