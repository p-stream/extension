# P-Stream Extension

Enhance your experience with just one click!

## About

The extension is an optional "plugin" for P-Stream (and all movie-web forks) that adds a more sources that usually yield a better-quality stream!

In simple terms: it acts as a local proxy. Imagine it opens an invisible tab to extract (scrape) the stream from the desired website. The only difference is that the extension can send specific headers, cookies, and is locally based. Some sources have restrictions that block scrapers; the extension helps us bypass that, such as IP restrictions, where the stream needs to be loaded on the same IP that it was originally scraped from.

In more complex terms: It uses the declarativeNetRequest API to connect to third party sites and fetch their html content. Because browsers have Cross Origin Resource Security (CORS) that protects sites from fetching content from other sites, a proxy is needed. This extension acts as a local proxy to bypass CORS and fetch the content.

During the onboarding process (/onboarding) the user can select between 3 options:
- Extension - This gives the user the most sources —sometimes with the best quality. (This extension)
- Custom Proxy - The user can host their own remote proxy on a service like Netlify to bypass restrictions, however, it can't do everything the extension can.
- Default Setup - This is the default and requires no user action, just pick it and watch. The site comes with default proxies already configured. The downsides are you are sharing bandwidth with other users and there are fewer sources.

### Why does the extension ask to "Access Data on All Sites"?
- This project (movie-web) is designed to be 100% self-hostable and is completely open-source. Hard coding a set list of sites that it asks for permission would prevent the extension from working on self-hosted sites. The user would need to edit the code to manually add their site to the permission list.
- Because we scrape from many sites, it would be tedious to allow every site.

## Safety
- It's **not required** to use P-Stream, it's entirely optional. 
- It doesn't track the user in any way or send data to any site besides the site you intend to use it with.
- **All of the code is open-source and anyone can inspect it.** 
- The extension **must** be enabled on a per site basis, otherwise the connecting site cannot talk to the extension (using runtime.sendMessage). 
> Previously offical sites were hardcoded to automatically be enabled on, but due to concerns about how this could be abused, that has been removed. **We do not believe this was ever exploited.**

### Will this ever work with Safari?
TL:DR: No, Apple's restrictions make it impossible currently.

1. Problem's with WebKit’s declarativeNetRequest API:
The extension is a local CORS proxy used to change request headers so we can scrape content. However, WebKit’s implementation is “incomplete”… Half of the headers that we need to change, simply don’t work because Apple has blacklisted many, and some are simply half-baked. https://bugs.webkit.org/show_bug.cgi?id=290922

2. Orion (A Webkit browser with extension support) had 2 issues: 
Firstly, Orion is using WebKit’s DNR API, which is the main problem. Technically it’s possible for them to use Firefox’s for example, but it hasn’t been done yet. Secondly, the runtime.sendMessage API is currently broken in Orion. So the extension literally cannot talk to the website and vice verca. 
https://orionfeedback.org/d/8053-extensions-support-for-declarativenetrequest-redirects/11

These can both be fixed, and I’m surprised WebKit’s APIs are so under-baked but it is what it is. 

## Running for development

We use pnpm with the latest version of NodeJS.

```sh
pnpm i
pnpm dev
```

## Building for production

```sh
pnpm i
pnpm build
or
pnpm build:firefox
```

