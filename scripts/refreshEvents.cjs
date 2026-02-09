// scripts/refreshEvents.js
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const admin = require("firebase-admin");

// --- Firebase Admin init (service account) ---
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
});
const db = admin.firestore();

// -------- utilities --------
function normalizeText(s) {
    return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function buildBaseKey(ev) {
  return `${slugify(ev.Name)}__${slugify(ev.Location)}`;
}
function slugify(s) {
    return normalizeText(s)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
}
function buildDedupeKey(ev) {
    // name + date + location = usually enough
    return `${slugify(ev.Name)}__${slugify(ev.Date)}__${slugify(ev.Location)}`;
}
function guessArtistsFromTitle(title) {
    const t = normalizeText(title);
    if (!t) return [];
    const first = t.split("|")[0].split("@")[0];
    const parts = first
        .split(/(?:\sx\s|,|&| feat\. | ft\. )/i)
        .map(p => normalizeText(p))
        .filter(Boolean);
    return parts.length <= 6 ? parts : [];
}

async function fetchHtml(url) {
    const res = await axios.get(url, {
        timeout: 30000,
        headers: {
            "User-Agent":
                "Mozilla/5.0 (compatible; SkopjeEventsBot/1.0; +https://example.com)",
            "Accept-Language": "en-US,en;q=0.9,mk;q=0.8",
        },
    });
    return res.data;
}
function pickMeta($, prop) {
    return (
        $(`meta[property='${prop}']`).attr("content") ||
        $(`meta[name='${prop}']`).attr("content") ||
        ""
    );
}
function absUrl(base, href) {
    if (!href) return "";
    if (href.startsWith("http")) return href;
    if (href.startsWith("//")) return "https:" + href;
    if (href.startsWith("/")) return base.replace(/\/$/, "") + href;
    return base.replace(/\/$/, "") + "/" + href;
}

function toEventObject(partial, provider) {
    const Name = normalizeText(partial.Name) || "Untitled";
    const Date = normalizeText(partial.Date) || ""; // keep as string
    const Description = normalizeText(partial.Description) || "";
    const ImageUrl = normalizeText(partial.ImageUrl) || "";
    const Location = normalizeText(partial.Location) || "Skopje";
    const TicketPrice = normalizeText(partial.TicketPrice) || "";
    const Artists =
        Array.isArray(partial.Artists) && partial.Artists.length
            ? partial.Artists.map(normalizeText).filter(Boolean)
            : guessArtistsFromTitle(Name);

    const ev = {
        Name,
        Date,
        Description,
        ImageUrl,
        Location,
        TicketPrice,
        Artists,
    };
    const BaseKey = buildBaseKey(ev);

    const DedupeKey = ev.Date && ev.Date !== "TBA"
    ? `${BaseKey}__${slugify(ev.Date)}`
    : BaseKey;

    return {
        ...ev,
        Provider: provider,
        SourceUrl: normalizeText(partial.SourceUrl) || "",
        BaseKey,
         DedupeKey,
        UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
}

// -------- scrapers (best-effort, may need small selector tweaks) --------

async function scrapeSkopjeIn() {
    const base = "https://www.skopje.in";
    const listUrl = `${base}/upcoming-events`;
    const html = await fetchHtml(listUrl);
    const $ = cheerio.load(html);

    const links = new Set();
    $("a[href]").each((_, a) => {
        const href = $(a).attr("href");
        if (!href) return;
        if (href.includes("?lightbox=")) return;
        if (href.includes("/event") || href.includes("/events")) {
            links.add(absUrl(base, href).split("#")[0]);
        }
    });

    const detailUrls = Array.from(links).slice(0, 60);
    const out = [];

    for (const url of detailUrls) {
        try {
            const dhtml = await fetchHtml(url);
            const $$ = cheerio.load(dhtml);

            const name = normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");
            const description = pickMeta($$, "og:description") || normalizeText($$("p").first().text());
            const imageUrl = pickMeta($$, "og:image");
            let date =
            $$("time").first().attr("datetime") ||
            normalizeText($$("time").first().text()) ||
            "";

// fallback 1: JSON-LD
            if (!date) date = dateFromJsonLd($$);

// fallback 2: URL
            if (!date) date = dateFromUrl(url);

// fallback 3: meta / page text
            if (!date) {
            const metaDesc = pickMeta($$, "og:description");
            date = dateFromText(metaDesc) || dateFromText($$.text());
            }
            const location =
                normalizeText($$("[class*='location'], [class*='venue']").first().text()) ||
                "Skopje";

            out.push(
                toEventObject(
                    { Name: name, Date: date, Description: description, ImageUrl: imageUrl, Location: location, TicketPrice: "", Artists: [], SourceUrl: url },
                    "skopje.in"
                )
            );
        } catch { }
    }

    return out;
}

async function scrapeKadevecer() {
    const base = "https://www.kadevecer.online";
    const listUrl = `${base}/events`;
    const html = await fetchHtml(listUrl);
    const $ = cheerio.load(html);

    const links = new Set();
    $("a[href]").each((_, a) => {
        const href = $(a).attr("href");
        if (!href) return;
        if (href.includes("/event") || href.includes("/events/")) {
            links.add(absUrl(base, href).split("#")[0]);
        }
    });

    const detailUrls = Array.from(links).slice(0, 60);
    const out = [];

    for (const url of detailUrls) {
        try {
            const dhtml = await fetchHtml(url);
            const $$ = cheerio.load(dhtml);

            const name = normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");
            const description = pickMeta($$, "og:description") || normalizeText($$("p").first().text());
            const imageUrl = pickMeta($$, "og:image");
            let date =
            $$("time").first().attr("datetime") || normalizeText($$("time").first().text()) || "";
            if (!date) date = dateFromUrl(url);
            const location =
                normalizeText($$("[class*='location'], [class*='venue']").first().text()) ||
                "Skopje";

            out.push(
                toEventObject(
                    { Name: name, Date: date, Description: description, ImageUrl: imageUrl, Location: location, TicketPrice: "", Artists: [], SourceUrl: url },
                    "kadevecer"
                )
            );
        } catch { }
    }

    return out;
}

async function scrapeMkTickets() {
    const base = "https://mktickets.mk";
    const listUrl = `${base}/en/all-events/`;
    const html = await fetchHtml(listUrl);
    const $ = cheerio.load(html);

    const links = new Set();
    $("a[href]").each((_, a) => {
        const href = $(a).attr("href");
        if (!href) return;
        const h = href.toLowerCase();
        if ((href.includes("mktickets.mk") || href.startsWith("/")) && h.includes("event")) {
            links.add(absUrl(base, href).split("#")[0]);
        }
    });

    const detailUrls = Array.from(links).slice(0, 80);
    const out = [];

    for (const url of detailUrls) {
        try {
            const dhtml = await fetchHtml(url);
            const $$ = cheerio.load(dhtml);

            const name = normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");
            const description = pickMeta($$, "og:description") || normalizeText($$("p").first().text());
            let imageUrl =
            pickMeta($$, "og:image") ||
            $$("img").first().attr("src") ||
            $$("img").first().attr("data-src") ||
            "";

// if the imageUrl accidentally contains "<img ...", try to pull src=""
            if (imageUrl.includes("<img")) {
                const m = imageUrl.match(/src\s*=\s*["']([^"']+)["']/i);
                imageUrl = m ? m[1] : "";
                }

// make relative -> absolute
            if (imageUrl && imageUrl.startsWith("/")) {
                imageUrl = "https://mktickets.mk" + imageUrl;
            }

            let date =
            $$("time").first().attr("datetime") ||
            normalizeText($$("time").first().text()) ||
            "";

// fallback 1: try URL
            if (!date) date = dateFromUrl(url);

// fallback 2: try meta description or full page text
            if (!date) {
            const metaDesc = pickMeta($$, "og:description");
            date = dateFromText(metaDesc) || dateFromText($$.text());
            }

            const bodyText = normalizeText($$.text());
            const priceMatch = bodyText.match(/(\d+[.,]?\d*)\s*(ден|mkd|eur|€)/i);
            const ticketPrice = priceMatch ? priceMatch[0] : "";

            const location =
                normalizeText($$("[class*='venue'], [class*='location']").first().text()) ||
                "Skopje";

            out.push(
                toEventObject(
                    { Name: name, Date: date, Description: description, ImageUrl: imageUrl, Location: location, TicketPrice: ticketPrice, Artists: [], SourceUrl: url },
                    "mktickets"
                )
            );
        } catch { }
    }

    return out;
}
function dateFromUrl(url) {
  // matches dd-mm-yyyy in URL
  const m = (url || "").match(/(\d{2})-(\d{2})-(\d{4})/);
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  return `${dd}-${mm}-${yyyy}`; // matches the format you’re already using
}
function dateFromText(text) {
  const t = (text || "").replace(/\s+/g, " ");

  // 08.02.2026
  let m = t.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yyyy = m[3];
    return `${dd}-${mm}-${yyyy}`;
  }

  // 2026-02-08
  m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (m) {
    const yyyy = m[1], mm = m[2], dd = m[3];
    return `${dd}-${mm}-${yyyy}`;
  }

  return "";
}
function dateFromJsonLd($) {
  const scripts = $("script[type='application/ld+json']");
  for (let i = 0; i < scripts.length; i++) {
    try {
      const raw = $(scripts[i]).contents().text();
      const data = JSON.parse(raw);

      const items = Array.isArray(data) ? data : [data];
      for (const obj of items) {
        const start =
          obj?.startDate ||
          obj?.eventSchedule?.startDate ||
          obj?.["@graph"]?.find?.(x => x?.startDate)?.startDate;

        if (typeof start === "string" && start) {
          // convert ISO to dd-mm-yyyy
          const d = new Date(start);
          if (!isNaN(d.getTime())) {
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = String(d.getFullYear());
            return `${dd}-${mm}-${yyyy}`;
          }
        }
      }
    } catch {}
  }
  return "";
}
// -------- Firestore insert: only new events --------
async function addOnlyNewEvents(events) {
    const byBase = new Map();

  for (const e of events) {
    if (!e.Name) continue;
    if (!e.Date) e.Date = "TBA";

    const score =
      (e.Description ? 1 : 0) +
      (e.ImageUrl ? 1 : 0) +
      (e.TicketPrice ? 1 : 0) +
      (e.Artists?.length ? 1 : 0) +
      (e.Date && e.Date !== "TBA" ? 1 : 0);

    const prev = byBase.get(e.BaseKey);
    if (!prev || score > prev.score) byBase.set(e.BaseKey, { e, score });
  }

  const deduped = Array.from(byBase.values()).map(x => x.e);

  let added = 0;
  let updated = 0;

  for (const e of deduped) {
    const ref = db.collection("Events").doc(e.BaseKey);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set(e, { merge: true });
      added++;
      continue;
    }

    const existing = snap.data();

    // Don't downgrade a real date to TBA
    const incomingHasRealDate = e.Date && e.Date !== "TBA";
    const existingHasRealDate = existing.Date && existing.Date !== "TBA";

    const patch = { ...e };

    if (!incomingHasRealDate && existingHasRealDate) {
      patch.Date = existing.Date;
    }

    await ref.set(patch, { merge: true });
    updated++;
  }

  return { added, updated, checked: deduped.length };
}

// -------- main --------
(async function main() {
    try {
        console.log("Scraping sites...");
        const [kade, skopje, mkt] = await Promise.all([
            scrapeKadevecer(),
            scrapeSkopjeIn(),
            scrapeMkTickets(),
        ]);

        const combined = [...kade, ...skopje, ...mkt];
        console.log("Scraped:", {
            kadevecer: kade.length,
            skopjeIn: skopje.length,
            mktickets: mkt.length,
            total: combined.length,
        });
        console.log("Sample events:", combined.slice(0, 5).map(e => ({
        Provider: e.Provider,
        Name: e.Name,
        Date: e.Date,
        Location: e.Location,
        SourceUrl: e.SourceUrl
        })));

        console.log("Saving only new events to Firestore...");
        const res = await addOnlyNewEvents(combined);
        console.log(`Done ✅ Added ${res.added}, updated ${res.updated} (checked ${res.checked}).`);

        console.log(`Done ✅ Added ${res.added} new events (checked ${res.checked}).`);
        process.exit(0);
    } catch (err) {
        console.error("FAILED:", err);
        process.exit(1);
    }
})();
