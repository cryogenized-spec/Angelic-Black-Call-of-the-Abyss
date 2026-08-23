from __future__ import annotations

import json
import shutil
import subprocess
import tarfile
import tempfile
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'assets' / 'ASSET_MANIFEST.json'


def download(url: str, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    req = Request(url, headers={'User-Agent': 'Angelic-Black-Asset-Materializer/1.0'})
    with urlopen(req, timeout=60) as response:
        target.write_bytes(response.read())


def vendor_font(package: str, css_path: str) -> None:
    destination = ROOT / Path(css_path).parent
    destination.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as td:
        tarball = subprocess.check_output(['npm', 'pack', package, '--silent'], cwd=td, text=True).strip()
        with tarfile.open(Path(td) / tarball, 'r:gz') as archive:
            package_root = sorted({m.name.split('/')[0] for m in archive.getmembers() if '/' in m.name})[0]
            archive.extractall(td)
            src = Path(td) / package_root
            shutil.copy2(src / '400.css', destination / '400.css')
            target_files = destination / 'files'
            if target_files.exists():
                shutil.rmtree(target_files)
            shutil.copytree(src / 'files', target_files)


def patch_file(path: Path, replacements: dict[str, str]) -> None:
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    image_replacements: dict[str, str] = {}
    local_only = []

    for item in manifest.get('images', []):
        if 'path' not in item:
            raise SystemExit(f"Invalid image manifest entry without path: {item!r}")

        target = ROOT / item['path']
        url = item.get('url')

        if url:
            download(url, target)
            image_replacements[url] = '../' + item['path']
        elif target.exists():
            local_only.append(item['path'])
        else:
            raise SystemExit(
                f"Image asset has no url and is not present locally: {item['path']}"
            )

    for item in manifest.get('fonts', []):
        vendor_font(item['package'], item['css'])

    patch_file(ROOT / 'src/js/modules/01-setup.js', image_replacements)
    patch_file(ROOT / 'src/game.html', image_replacements)
    patch_file(ROOT / 'src/game.html', {
        'https://cdn.jsdelivr.net/fontsource/css/press-start-2p@latest/index.css': '../assets/fonts/press-start-2p/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/grenze-gotisch@latest/index.css': '../assets/fonts/grenze-gotisch/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/eb-garamond@latest/index.css': '../assets/fonts/eb-garamond/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/unifrakturmaguntia@latest/index.css': '../assets/fonts/unifrakturmaguntia/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/noto-serif-jp@latest/index.css': '../assets/fonts/noto-serif-jp/400.css',
    })

    remaining = []
    for file in [ROOT / 'src/game.html', *ROOT.glob('src/js/**/*.js')]:
        text = file.read_text(encoding='utf-8')
        if 'image.qwenlm.ai' in text or 'cdn.jsdelivr.net/fontsource/css' in text or 'fonts.googleapis.com' in text or 'fonts.gstatic.com' in text:
            remaining.append(str(file.relative_to(ROOT)))
    if remaining:
        raise SystemExit('External runtime asset URLs remain in: ' + ', '.join(remaining))

    if local_only:
        print('Local-only image assets retained:')
        for path in local_only:
            print(f'  - {path}')


if __name__ == '__main__':
    main()
