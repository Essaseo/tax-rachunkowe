# TAX Biuro Rachunkowe – Strona WWW

Astro 4 + Decap CMS + Cloudflare Pages

## Stack
- **Framework:** Astro 4 (statyczny SSG)
- **CMS:** Decap CMS (panel admina pod `/admin`)
- **Hosting:** Cloudflare Pages (lub Netlify)
- **Fonty:** Cormorant Garamond + DM Sans (Google Fonts)
- **Formularze:** Netlify Forms (wbudowane)

---

## Pierwsze uruchomienie

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # generuje /dist
```

---

## Deploy na Cloudflare Pages

1. Wrzuć repozytorium na GitHub
2. Zaloguj do [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project
3. Podłącz GitHub repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Node version:** `20`
5. Kliknij Save & Deploy

---

## Konfiguracja CMS (Decap)

### Opcja A – Netlify Identity (prostsze)
1. Wdróż projekt na **Netlify** (zamiast Cloudflare Pages)
2. W panelu Netlify: Identity → Enable Identity
3. Settings → Registration: **Invite only**
4. Zaprosić e-mail klienta
5. Panel admina dostępny pod: `https://twojadomena.pl/admin`

### Opcja B – Cloudflare Access (dla Cloudflare Pages)
1. W `public/admin/config.yml` zmień backend na:
   ```yaml
   backend:
     name: github
     repo: TWOJ-USER/TWOJE-REPO
     branch: main
   ```
2. Zaloguj przez GitHub OAuth

---

## Dostosowanie treści

### Dane firmy (zmień w kodzie)
- `src/layouts/BaseLayout.astro` – telefon, adres, e-mail w stopce i Schema.org
- `src/pages/index.astro` – statystyki w hero, dane kontaktowe
- `astro.config.mjs` – docelowa domena `site:`
- `public/robots.txt` – URL sitemap

### Kolory marki
Wszystkie zmienne CSS w `src/styles/global.css`:
```css
--gold:       #CD9C38
--gold-light: #F9F4BC
--navy:       #090F41
--blue:       #13187E
```

---

## Dodawanie wpisów na blogu (bez CMS)

Utwórz plik `src/content/blog/nazwa-wpisu.md`:

```markdown
---
title: "Tytuł artykułu"
excerpt: "Opis do 160 znaków dla SEO"
date: "2025-03-01"
category: "VAT"
readTime: "5 min czytania"
image: "/images/blog/zdjecie.jpg"
imageAlt: "Opis zdjęcia"
---

## Nagłówek sekcji

Treść artykułu w Markdown...
```

---

## Struktura projektu

```
tax-biuro/
├── public/
│   ├── admin/
│   │   ├── index.html      ← panel Decap CMS
│   │   └── config.yml      ← konfiguracja CMS
│   ├── images/
│   │   └── logo.png
│   └── robots.txt
├── src/
│   ├── content/
│   │   └── blog/           ← pliki .md (wpisy blogowe)
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro     ← strona główna
│   │   ├── dziekujemy.astro
│   │   └── blog/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── netlify.toml            ← headers, cache, redirects
└── package.json
```

---

## PageSpeed / SEO checklist

- ✅ Statyczny HTML – brak JS runtime
- ✅ Fonty z preconnect
- ✅ Lazy loading obrazków
- ✅ `loading="eager"` tylko dla logo w hero
- ✅ Schema.org (LocalBusiness + BlogPosting)
- ✅ Open Graph + Twitter Card
- ✅ Sitemap auto (astro-sitemap)
- ✅ Cache headers dla assets (1 rok)
- ✅ Security headers (X-Frame-Options etc.)
- ✅ robots.txt z Sitemap URL
- ✅ Canonical URL
- ✅ ARIA labels na elementach interaktywnych

**Po wdrożeniu dodaj ręcznie:**
- [ ] Favicon (`public/favicon.ico` / `favicon.svg`)
- [ ] OG image (`public/images/og-default.jpg`, 1200×630)
- [ ] Google Analytics / GA4 (w BaseLayout `<head>`)
- [ ] Dane kontaktowe (telefon, adres, NIP)
