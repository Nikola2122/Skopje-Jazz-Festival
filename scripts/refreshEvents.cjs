
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const admin = require("firebase-admin");


const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
});
const db = admin.firestore();


function normalizeText(s) {
    return (s ?? "").toString().trim().replace(/\s+/g, " ");
}
function isEmpty(v) {
    return v == null || (typeof v === "string" && v.trim() === "") || v === "TBA";
}
function kadevecerCityFromUrl(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("-skopje")) return "Skopje";
  if (u.includes("-скопје")) return "Скопје";
  return "";
}

function preferExisting(existing, incoming) {

    return isEmpty(existing) ? incoming : existing;
}
function slugify(s) {
    return normalizeText(s)
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
}

function buildBaseKey(ev) {
    return `${slugify(ev.Name)}__${slugify(ev.Location)}`;
}

function guessArtistsFromTitle(title) {
    const t = normalizeText(title);
    if (!t) return [];
    const first = t.split("|")[0].split("@")[0];
    const parts = first
        .split(/(?:\sx\s|,|&| feat\. | ft\. )/i)
        .map((p) => normalizeText(p))
        .filter(Boolean);
    return parts.length <= 6 ? parts : [];
}
async function artistExistsByName(name) {
    const id = artistDocId(name);
    const snap = await db.collection("Artists").doc(id).get();
    return snap.exists;
}

async function createArtistIfMissing_Minimal(name, provider, sourceUrl) {
    const clean = normalizeText(name);
    if (!clean) return;

    const id = artistDocId(clean);
    const ref = db.collection("Artists").doc(id);
    const snap = await ref.get();

    if (!snap.exists) {
        await ref.set(
            {
                Name: clean,
                RoleInstrument: "",
                Categories: "",
                Provider: provider || "",
                SourceUrl: sourceUrl || "",
                CreatedAt: admin.firestore.FieldValue.serverTimestamp(),
                UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    }
}

function isStandupTitle(name) {
    return /stand\s*up/i.test(name || "");
}

function extractArtistFromSkopjeTitle(title) {
    // expects "Concert by {artist}"
    const t = normalizeText(title);
    const m = t.match(/^Concert by\s+(.+)$/i);
    return m ? normalizeText(m[1]) : "";
}
function parseDdMmYyyyToDate(dateStr) {
    const s = normalizeText(dateStr);
    if (!s || s === "TBA") return null;

    const m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    if (!m) return null;

    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);

    const d = new Date(yyyy, mm - 1, dd);
    if (Number.isNaN(d.getTime())) return null;
    return d;
}

function startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}


function artistDocId(name) {
    return slugify(name);
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function fetchHtml(url, opts = {}) {
    const timeout = opts.timeout ?? 60000;
    const retries = opts.retries ?? 3;
    const backoffMs = opts.backoffMs ?? 1500;

    let lastErr;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await axios.get(url, {
                timeout,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9,mk;q=0.8",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Connection": "keep-alive",
                },
            });
            return res.data;
        } catch (err) {
            const status = err?.response?.status;
            const code = err?.code || "";

            const retryable =
                code === "ECONNABORTED" || code === "ETIMEDOUT" ||
                status === 429 || (status >= 500 && status <= 599);

            if (!retryable || attempt === retries) throw err;


            const ra = err?.response?.headers?.["retry-after"];
            let wait = backoffMs * attempt + Math.floor(Math.random() * 500);
            if (ra) {
                const raNum = Number(ra);
                if (!Number.isNaN(raNum)) wait = Math.max(wait, raNum * 1000);
            }

            console.log(`[fetchHtml] retry ${attempt}/${retries} for ${url} (status=${status || "?"}) wait ${wait}ms`);
            await sleep(wait);
        }
    }

    throw lastErr;
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


function dateFromUrl(url) {

    const m = (url || "").match(/(\d{2})-(\d{2})-(\d{4})/);
    if (!m) return "";
    const [, dd, mm, yyyy] = m;
    return `${dd}-${mm}-${yyyy}`;
}

function dateFromText(text) {
    const t = (text || "").replace(/\s+/g, " ");


    let m = t.match(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/);
    if (m) {
        const dd = m[1].padStart(2, "0");
        const mm = m[2].padStart(2, "0");
        const yyyy = m[3];
        return `${dd}-${mm}-${yyyy}`;
    }


    m = t.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (m) {
        const yyyy = m[1],
            mm = m[2],
            dd = m[3];
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
                    obj?.["@graph"]?.find?.((x) => x?.startDate)?.startDate;

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
        } catch { }
    }
    return "";
}


function toEventObject(partial, provider) {
    const Name = normalizeText(partial.Name) || "Untitled";
    const Date = normalizeText(partial.Date) || "";
    const Description = normalizeText(partial.Description) || "";
    const ImageUrl = normalizeText(partial.ImageUrl) || "";
    const Location = normalizeText(partial.Location) || "Skopje";
    const TicketPrice = normalizeText(partial.TicketPrice) || "";
    let Artists =
        Array.isArray(partial.Artists) && partial.Artists.length
            ? partial.Artists.map(normalizeText).filter(Boolean)
            : [];

    if (!Artists.length && provider === "skopje.in") {
        Artists = guessArtistsFromTitle(Name);
    }


    const categories = normalizeText(partial.categories) || "";

    const ev = {
        Name,
        Date,
        Description,
        ImageUrl,
        Location,
        TicketPrice,
        Artists,
        categories,
    };

    const BaseKey = buildBaseKey(ev);


    const DedupeKey =
        ev.Date && ev.Date !== "TBA" ? `${BaseKey}__${slugify(ev.Date)}` : BaseKey;

    return {
        ...ev,
        Provider: provider,
        SourceUrl: normalizeText(partial.SourceUrl) || "",
        BaseKey,
        DedupeKey,
        UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
}


async function scrapeKadevecerArtists(maxPages = 7) {
    const base = "https://www.kadevecer.online";

    function cleanCategoriesString(s) {
        const t = normalizeText(s || "");
        if (!t) return "";

        const parts = t
            .split(/,|•|\||\/|·/g)
            .map(x => normalizeText(x))
            .filter(Boolean);


        const badWords = ["view", "review", "members", "youtube", "instagram", "facebook", "share"];
        const filtered = parts.filter(p => {
            const low = p.toLowerCase();
            if (p.length > 80) return false;
            if (badWords.some(w => low.includes(w))) return false;
            return true;
        });


        const seen = new Set();
        const uniq = [];
        for (const p of filtered) {
            const k = p.toLowerCase();
            if (!seen.has(k)) {
                seen.add(k);
                uniq.push(p);
            }
        }

        return uniq.join(", ");
    }

    async function getArtistUrlsFromSitemap() {
        const sitemapUrl = `${base}/sitemap.xml`;
        const xml = await fetchHtml(sitemapUrl, { timeout: 60000, retries: 3 });

        const locs = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1]);
        const artistUrls = locs
            .filter(u => u.startsWith(`${base}/artists/`))
            .map(u => u.split("#")[0]);

        console.log(`[artists] sitemap: found ${artistUrls.length} artist urls`);
        return artistUrls;
    }

    async function getArtistUrlsFromPages() {
        const urls = new Set();
        for (let p = 1; p <= maxPages; p++) {
            const listUrl = p === 1 ? `${base}/artists` : `${base}/artists?page=${p}`;

            let html = "";
            try {
                html = await fetchHtml(listUrl, { timeout: 60000, retries: 2 });
            } catch (e) {
                console.log(
                    `[artists] page ${p} failed (${e?.code || e?.message || e}). Skipping pages -> will use sitemap.`
                );
                return [];
            }

            const $ = cheerio.load(html);
            $("a[href]").each((_, a) => {
                const href = $(a).attr("href");
                if (!href) return;
                if (href.startsWith("/artists/")) urls.add(absUrl(base, href).split("#")[0]);
            });

            console.log(`[artists] page ${p}: found ${urls.size} urls so far`);
        }
        return Array.from(urls);
    }

    console.log(`Scraping kadevecer artists (pages 1..${maxPages})...`);
    let artistUrls = await getArtistUrlsFromPages();

    if (!artistUrls.length) {
        artistUrls = await getArtistUrlsFromSitemap();
    }

    const out = [];

    for (const url of artistUrls) {
        try {
            const dhtml = await fetchHtml(url, { timeout: 60000, retries: 3 });
            const $$ = cheerio.load(dhtml);

            const name =
                normalizeText($$("h1").first().text()) ||
                normalizeText(pickMeta($$, "og:title"));
            if (!name) continue;


            const rawText = $$.text().replace(/\r/g, "");
            const pageText = rawText
                .replace(/[ \t]+/g, " ")
                .replace(/\n{2,}/g, "\n")
                .trim();
            let roleInstrument = "";
            let categories = "";


            function findHeaderRoleCats($$) {
                const h1 = $$("h1").first();
                if (!h1.length) return { role: "", cats: "" };


                const containers = [
                    h1.parent(),
                    h1.parent().parent(),
                    h1.closest("section"),
                    h1.closest("div"),
                ].filter(x => x && x.length);

                for (const c of containers) {

                    const candidates = c
                        .find("p, span, small, div, h2, h3")
                        .toArray()
                        .map(el => normalizeText($$(el).text()))
                        .filter(t => t && t.includes("•") && t.length < 120);

                    if (candidates.length) {
                        const best = candidates[0];
                        const [rolePart, catsPart] = best.split("•").map(s => normalizeText(s));
                        return { role: rolePart || "", cats: catsPart || "" };
                    }
                }

                return { role: "", cats: "" };
            }


            function cleanCategoriesString(s) {
                const t = normalizeText(s || "");
                if (!t) return "";

                const parts = t
                    .split(/,|•|\||\/|·/g)
                    .map(x => normalizeText(x))
                    .filter(Boolean);

                const badWords = ["view", "review", "members", "youtube", "instagram", "facebook", "share"];
                const filtered = parts.filter(p => {
                    const low = p.toLowerCase();
                    if (p.length > 80) return false;
                    if (badWords.some(w => low.includes(w))) return false;
                    return true;
                });

                const seen = new Set();
                const uniq = [];
                for (const p of filtered) {
                    const k = p.toLowerCase();
                    if (!seen.has(k)) {
                        seen.add(k);
                        uniq.push(p);
                    }
                }

                return uniq.join(", ");
            }


            {
                const { role, cats } = findHeaderRoleCats($$);
                if (role) roleInstrument = role;
                if (cats) categories = cleanCategoriesString(cats);
            }


            if (!roleInstrument) {
                const m = pageText.match(/\bType:\s*([^\n]+)\b/i);
                if (m) roleInstrument = normalizeText(m[1]);
            }


            if (!categories) {
                const idx = pageText.toLowerCase().indexOf("type:");
                if (idx !== -1) {
                    const after = pageText.slice(idx);
                    const lines = after.split("\n").map(l => normalizeText(l)).filter(Boolean);


                    const roleLower = (roleInstrument || "").toLowerCase();
                    for (let i = 1; i < Math.min(lines.length, 8); i++) {
                        const candidate = lines[i];
                        const low = candidate.toLowerCase();

                        if (!candidate) continue;
                        if (low.includes("view") || low.includes("review") || low.includes("members")) continue;
                        if (roleLower && low === roleLower) continue;

                        const cleaned = cleanCategoriesString(candidate);
                        if (cleaned && (!roleLower || cleaned.toLowerCase() !== roleLower)) {
                            categories = cleaned;
                            break;
                        }
                    }
                }
            }


            if (roleInstrument && categories && categories.toLowerCase() === roleInstrument.toLowerCase()) {
                categories = "";
            }


            let imageUrl = pickMeta($$, "og:image") || "";
            if (imageUrl && imageUrl.startsWith("/")) imageUrl = base + imageUrl;

            out.push({
                Name: name,
                RoleInstrument: roleInstrument || "",
                Categories: categories || "",
                ImageUrl: imageUrl || "",
                Provider: "kadevecer",
                SourceUrl: url,
            });


            if (out.length <= 3) {
                console.log("[artist parsed]", {
                    Name: name,
                    RoleInstrument: roleInstrument || "",
                    Categories: categories || "",
                    SourceUrl: url,
                });
            }
        } catch (e) {
            console.log("[artists] failed:", url, e?.code || e?.message || e);
        }
    }


    const byName = new Map();
    for (const a of out) {
        const key = slugify(a.Name);
        if (!byName.has(key)) byName.set(key, a);
    }

    console.log(`[artists] scraped details: ${byName.size}`);
    return Array.from(byName.values());
}



async function upsertArtists(artists) {
    let added = 0;
    let updated = 0;

    for (const a of artists) {
        if (!a.Name) continue;
        const id = artistDocId(a.Name);
        const ref = db.collection("Artists").doc(id);
        const snap = await ref.get();

        const payload = {
            Name: a.Name,
            RoleInstrument: a.RoleInstrument || "Artist",
            Categories: a.Categories || "",
            ImageUrl: a.ImageUrl || "",
            Provider: a.Provider || "",
            SourceUrl: a.SourceUrl || "",
            UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (!snap.exists) {
            payload.CreatedAt = admin.firestore.FieldValue.serverTimestamp();
            await ref.set(payload, { merge: true });
            added++;
        } else {
            await ref.set(payload, { merge: true });
            updated++;
        }
    }

    return { added, updated, checked: artists.length };
}


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

            const title =
                normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");
            if (!/^Concert by\s+/i.test(title)) continue;
            const description = pickMeta($$, "og:description") || normalizeText($$("p").first().text());
            const artistName = extractArtistFromSkopjeTitle(title);
            if (!artistName) continue;
            const imageUrl = pickMeta($$, "og:image");
            let date =
                $$("time").first().attr("datetime") ||
                normalizeText($$("time").first().text()) ||
                "";


            if (!date) date = dateFromJsonLd($$);


            if (!date) date = dateFromUrl(url);


            if (!date) {
                const metaDesc = pickMeta($$, "og:description");
                date = dateFromText(metaDesc) || dateFromText($$.text());
            }
            const location =
                normalizeText($$("[class*='location'], [class*='venue']").first().text()) ||
                "Skopje";

            out.push(
                toEventObject(
                    { Name: title, Artists: [artistName], Date: date, Description: description, ImageUrl: imageUrl, Location: location, TicketPrice: "", categories: "", SourceUrl: url },
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

            const name =
                normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");


            if (isStandupTitle(name)) continue;

            const description =
                pickMeta($$, "og:description") || normalizeText($$("p").first().text());
            const imageUrl = pickMeta($$, "og:image");

            let date =
                $$("time").first().attr("datetime") ||
                normalizeText($$("time").first().text()) ||
                "";


            if (!date) date = dateFromJsonLd($$);
            if (!date) date = dateFromUrl(url);
            if (!date) {
                const metaDesc = pickMeta($$, "og:description");
                date = dateFromText(metaDesc) || dateFromText($$.text());
            }

            const location =
                normalizeText($$("[class*='location'], [class*='venue']").first().text()) ||
                "Skopje";

            out.push(
                toEventObject(
                    {
                        Name: name,
                        Date: date,
                        Description: description,
                        ImageUrl: imageUrl,
                        Location: location,
                        TicketPrice: "",
                        Artists: [],
                        SourceUrl: url,
                    },
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
        if (
            (href.includes("mktickets.mk") || href.startsWith("/")) &&
            h.includes("event")
        ) {
            links.add(absUrl(base, href).split("#")[0]);
        }
    });

    const detailUrls = Array.from(links).slice(0, 80);
    const out = [];

    for (const url of detailUrls) {
        try {
            const dhtml = await fetchHtml(url);
            const $$ = cheerio.load(dhtml);

            const name =
                normalizeText($$("h1").first().text()) || pickMeta($$, "og:title");
            const description =
                pickMeta($$, "og:description") || normalizeText($$("p").first().text());


            let imageUrl =
                pickMeta($$, "og:image") ||
                $$("img").first().attr("src") ||
                $$("img").first().attr("data-src") ||
                "";

            if (typeof imageUrl === "string" && imageUrl.includes("<img")) {
                const m = imageUrl.match(/src\s*=\s*["']([^"']+)["']/i);
                imageUrl = m ? m[1] : "";
            }
            if (imageUrl && imageUrl.startsWith("/")) imageUrl = base + imageUrl;

            let date =
                $$("time").first().attr("datetime") ||
                normalizeText($$("time").first().text()) ||
                "";


            if (!date) date = dateFromJsonLd($$);
            if (!date) date = dateFromUrl(url);
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
                    {
                        Name: name,
                        Date: date,
                        Description: description,
                        ImageUrl: imageUrl,
                        Location: location,
                        TicketPrice: ticketPrice,
                        Artists: [],
                        SourceUrl: url,
                    },
                    "mktickets"
                )
            );
        } catch { }
    }

    return out;
}
async function deletePastEvents() {
    console.log("Deleting past events (Date < today OR Date is TBA) ...");

    const today = startOfToday();
    let deleted = 0;

    let lastDoc = null;

    while (true) {
        let q = db.collection("Events").orderBy("__name__").limit(400);
        if (lastDoc) q = q.startAfter(lastDoc);

        const snap = await q.get();
        if (snap.empty) break;

        const batch = db.batch();
        let batchCount = 0;

        for (const doc of snap.docs) {
            const data = doc.data() || {};
            const raw = normalizeText(data.Date);

            const isTBA =
                !raw ||
                raw.toUpperCase() === "TBA" ||
                raw === "-" ||
                raw.toLowerCase() === "tbd";

            const parsed = isTBA ? null : parseDdMmYyyyToDate(raw);

            const shouldDelete =
                isTBA || (parsed && parsed < today) || (!isTBA && !parsed);

            if (shouldDelete) {
                batch.delete(doc.ref);
                batchCount++;
                deleted++;
            }
        }

        if (batchCount > 0) {
            await batch.commit();
        }

        lastDoc = snap.docs[snap.docs.length - 1];
    }

    console.log(`Events deleted ✅ ${deleted}`);
    return deleted;
}


async function addOnlyNewEvents(events) {

    const byBase = new Map();

    for (const e of events) {
        if (!e.Name) continue;
        if (!e.Date) e.Date = "TBA";

        const score =
            (e.Description && e.Description !== "TBA" ? 1 : 0) +
            (e.ImageUrl && e.ImageUrl !== "TBA" ? 1 : 0) +
            (e.TicketPrice && e.TicketPrice !== "TBA" ? 1 : 0) +
            (e.Artists?.length ? 1 : 0) +
            (e.Date && e.Date !== "TBA" ? 1 : 0);

        const prev = byBase.get(e.BaseKey);
        if (!prev || score > prev.score) byBase.set(e.BaseKey, { e, score });
    }

    const deduped = Array.from(byBase.values()).map((x) => x.e);


    const artistCache = new Map();
    async function getArtistCategories(artistName) {
        const key = artistDocId(artistName);
        if (artistCache.has(key)) return artistCache.get(key);

        const snap = await db.collection("Artists").doc(key).get();
        const cats = snap.exists ? normalizeText(snap.data()?.Categories || "") : "";
        artistCache.set(key, cats);
        return cats;
    }

    let added = 0;
    let updated = 0;

    for (const e of deduped) {

        let finalArtists = Array.isArray(e.Artists) ? e.Artists.map(normalizeText).filter(Boolean) : [];

        if (e.Provider === "skopje.in") {

            for (const aName of finalArtists) {
                const exists = await artistExistsByName(aName);
                if (!exists) {
                    await createArtistIfMissing_Minimal(aName, "skopje.in", e.SourceUrl);
                }
            }
        } else {
            const keep = [];
            for (const aName of finalArtists) {
                if (await artistExistsByName(aName)) keep.push(aName);
            }
            finalArtists = keep;
        }

        e.Artists = finalArtists;

        let cats = "";
        for (const aName of e.Artists || []) {
            const c = await getArtistCategories(aName);
            if (c) {
                cats = c;
                break;
            }
        }

        const ref = db.collection("Events").doc(e.BaseKey);
        const snap = await ref.get();

        const incomingHasRealDate = e.Date && e.Date !== "TBA";

        if (!snap.exists) {
            const payload = {
                ...e,
                categories: cats || e.categories || "",
                isNew: true,
                CreatedAt: admin.firestore.FieldValue.serverTimestamp(),
                UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await ref.set(payload, { merge: true });
            added++;
            continue;
        }

        const existing = snap.data() || {};
   

        const patch = {
            Name: existing.Name ?? e.Name,
            Provider: existing.Provider ?? e.Provider,
            SourceUrl: existing.SourceUrl ?? e.SourceUrl,

            Date: preferExisting(existing.Date, e.Date),
            Description: preferExisting(existing.Description, e.Description),
            ImageUrl: preferExisting(existing.ImageUrl, e.ImageUrl),
            Location: preferExisting(existing.Location, e.Location),
            TicketPrice: preferExisting(existing.TicketPrice, e.TicketPrice),


            Artists: (Array.isArray(existing.Artists) && existing.Artists.length) ? existing.Artists : e.Artists,

            categories: preferExisting(existing.categories, e.categories),

            isNew: false,
            UpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (!incomingHasRealDate && existingHasRealDate) {
            patch.Date = existing.Date;
        }

        await ref.set(patch, { merge: true });
        updated++;
    }

    return { added, updated, checked: deduped.length };
}
async function safe(label, fn) {
    try {
        const data = await fn();
        console.log(`${label} ✅ ${data.length}`);
        return data;
    } catch (e) {
        const status = e?.response?.status;
        console.log(`${label} ❌ skipped (${status || e?.code || e?.message || e})`);
        return [];
    }
}

(async function main() {
    let artists = [];
    try {
        artists = await scrapeKadevecerArtists(7);
        const artistRes = await upsertArtists(artists);
        console.log(`Artists ✅ added ${artistRes.added}, updated ${artistRes.updated} (checked ${artistRes.checked})`);
    } catch (e) {
        const status = e?.response?.status;
        console.log("Artists scrape skipped due to error:",status || e?.code || e?.message || e);
    }
    try {

        console.log("Scraping events...");
        const kade = await safe("kadevecer", scrapeKadevecer);
        const skopje = await safe("skopje.in", scrapeSkopjeIn);
        const mkt = await safe("mktickets", scrapeMkTickets);

        const combined = [...kade, ...skopje, ...mkt];

        console.log("Scraped:", {
            kadevecer: kade.length,
            skopjeIn: skopje.length,
            mktickets: mkt.length,
            total: combined.length,
        });

        console.log(
            "Sample events:",
            combined.slice(0, 5).map((e) => ({
                Provider: e.Provider,
                Name: e.Name,
                Date: e.Date,
                Location: e.Location,
                Artists: e.Artists,
                categories: e.categories,
                SourceUrl: e.SourceUrl,
            }))
        );

        console.log("Saving only new/updated events to Firestore...");
        const res = await addOnlyNewEvents(combined);
        console.log(`Done ✅ Added ${res.added}, updated ${res.updated} (checked ${res.checked}).`);
        await deletePastEvents();

        process.exit(0);
    } catch (err) {
        console.error("FAILED:", err);
        process.exit(1);
    }
})();
