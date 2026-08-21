from __future__ import annotations

import json
import re
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
            members = archive.getmembers()
            wanted_css = next(m for m in members if m.name.endswith('/400.css'))
            archive.extract(wanted_css, td)
            shutil.copy2(Path(td) / wanted_css.name.split('/')[0] / '400.css', destination / '400.css')
            files_dir = Path(td) / wanted_css.name.split('/')[0] / 'files'
            target_files = destination / 'files'
            if target_files.exists():
                shutil.rmtree(target_files)
            shutil.copytree(files_dir, target_files)


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
    for item in manifest['images']:
        target = ROOT / item['path']
        download(item['url'], target)
        image_replacements[item['url']] = '../' + item['path']

    for item in manifest['fonts']:
        vendor_font(item['package'], item['css'])

    patch_file(ROOT / 'src/js/modules/01-setup.js', image_replacements)
    patch_file(ROOT / 'src/game.html', image_replacements)

    font_replacements = {
        'https://cdn.jsdelivr.net/fontsource/css/press-start-2p@latest/index.css': '../assets/fonts/press-start-2p/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/grenze-gotisch@latest/index.css': '../assets/fonts/grenze-gotisch/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/eb-garamond@latest/index.css': '../assets/fonts/eb-garamond/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/unifrakturmaguntia@latest/index.css': '../assets/fonts/unifrakturmaguntia/400.css',
        'https://cdn.jsdelivr.net/fontsource/css/noto-serif-jp@latest/index.css': '../assets/fonts/noto-serif-jp/400.css',
    }
    patch_file(ROOT / 'src/game.html', font_replacements)

    remaining = []
    for path in [ROOT / 'src/game.html', ROOT / 'src/js']:
        files = [path] if path.is_file() else list(path.rglob('*.js'))
        for file in files:
            text = file.read_text(encoding='utf-8')
            if 'image.qwenlm.ai' in text or 'cdn.jsdelivr.net/fontsource' in text:
                remaining.append(str(file.relative_to(ROOT)))
    if remaining:
        raise SystemExit('External runtime asset URLs remain in: ' + ', '.join(remaining))


if __name__ == '__main__':
    main()
