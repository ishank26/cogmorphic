# Flatten the Astro dist into the preview artifact layout (relative links, assets/ folder).
import re, os, shutil, sys
dist, out = sys.argv[1], sys.argv[2]
pages = {'index.html':'index.html','ai-agents-for-business/index.html':'ai-agents-for-business.html',
         'personal-ai-agents/index.html':'personal-ai-agents.html','free-ai-audit/index.html':'free-ai-audit.html',
         'privacy/index.html':'privacy.html'}
route = {'/':'index.html','/ai-agents-for-business/':'ai-agents-for-business.html','/personal-ai-agents/':'personal-ai-agents.html',
         '/free-ai-audit/':'free-ai-audit.html','/privacy/':'privacy.html'}
os.makedirs(out+'/assets', exist_ok=True)
shader = ([f for f in os.listdir(dist+'/_astro') if f.startswith('ShaderBg')] or [None])[0]
for f in os.listdir(dist+'/_astro'):
    if f.endswith('.woff2') and ('latin' in f) and ('cyrillic' not in f):
        shutil.copy(f'{dist}/_astro/{f}', f'{out}/assets/{f}')
    if f.endswith('.js') and not f.startswith('ShaderBg'):
        shutil.copy(f'{dist}/_astro/{f}', f'{out}/assets/{f}')
if shader:
    js = open(f'{dist}/_astro/{shader}').read().replace('/_astro/','./')
    js = js.replace('t=function(e){return"/"+e}','t=function(e){return e}').replace('function(e){return`/`+e}','function(e){return e}')
    open(out+'/assets/shader-bg.js','w').write(js)
for src, dst in pages.items():
    s = open(f'{dist}/{src}').read()
    s = re.sub(r'<link rel="(?:icon|apple-touch-icon|manifest|sitemap)"[^>]*?(?:favicon-32|apple-touch|webmanifest|sitemap)[^>]*>', '', s)
    if shader: s = s.replace(f'/_astro/{shader}', 'assets/shader-bg.js')
    s = s.replace('/_astro/', 'assets/')
    s = s.replace("url('/hero-mobile.png')", 'url(hero-mobile.png)').replace('url(/hero-mobile.png)', 'url(hero-mobile.png)')
    s = s.replace('href="/favicon.svg"', 'href="favicon.svg"')
    def fix(m):
        path, frag = m.group(2), m.group(3) or ''
        return f'{m.group(1)}="{route[path]}{frag}"' if path in route else m.group(0)
    s = re.sub(r'(href)="(/[^"#]*)(#[^"]*)?"', fix, s)
    if dst == 'index.html':
        s = re.sub(r'<title>[^<]*</title>', '<title>Cogmorphic Site Preview</title>', s)
        s = re.sub(r'<!DOCTYPE html>|<!doctype html>', '', s)
        s = re.sub(r'</?(?:html|head|body)\b[^>]*>', '', s)
    open(f'{out}/{dst}', 'w').write(s)
for f in ['favicon.svg','og-image.png','hero-mobile.png','third-party-notices.txt']:
    if os.path.exists(f'{dist}/{f}'): shutil.copy(f'{dist}/{f}', f'{out}/{f}')
print('ok', shader)
