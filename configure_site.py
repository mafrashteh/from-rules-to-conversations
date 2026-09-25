"""Configure metadata after the final public URL is known; stdlib only."""
from pathlib import Path
from urllib.parse import urlparse
from html import escape
import sys,re
if len(sys.argv)!=2:
    raise SystemExit('Usage: python3 configure_site.py https://USER.github.io/REPO/')
url=sys.argv[1].rstrip('/')+'/'
p=urlparse(url)
if p.scheme!='https' or not p.netloc or p.query or p.fragment or p.username or p.password:
    raise SystemExit('Use a public HTTPS URL without credentials, query, or fragment.')
f=Path(__file__).resolve().parent/'index.html'
s=f.read_text(encoding='utf-8')
s=re.sub(r'<link rel="canonical"[^>]*>','',s)
s=re.sub(r'<meta property="og:url"[^>]*>','',s)
s=re.sub(r'<meta property="og:image"[^>]*>', '<meta property="og:image" content="'+escape(url+'assets/og-image.png',quote=True)+'">',s)
s=s.replace('</head>','<link rel="canonical" href="'+escape(url,quote=True)+'"><meta property="og:url" content="'+escape(url,quote=True)+'"></head>')
f.write_text(s,encoding='utf-8')
print('Updated canonical, og:url and og:image in index.html')
