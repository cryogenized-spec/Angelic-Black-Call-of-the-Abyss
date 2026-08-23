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
    if not path.is_file():
        return
    text = path.read_text(encoding='utf-8')
    original = text
    for old, new in replacements.items():
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding='utf-8')


def materialize_images(items: list[dict]) -> dict[str, str]:
    replacements: dict[str, str] = {}
    missing_required: list[str] = []
    missing_optional: list[str] = []

    for item in items:
        path_value = item.get('path')
        if not path_value:
            raise SystemExit(f"Asset manifest image entry is missing 'path': {item!r}")

        target = ROOT / path_value
        url = item.get('url')
        required = bool(item.get('required', False))

        if url:
            download(url, target)
            replacements[url] = '../' + path_value
        elif not target.is_file():
            if required:
                missing_required.append(path_value)
            else:
                missing_optional.append(path_value)

    if missing_optional:
        print('Optional local image assets not present (allowed): ' + ', '.join(missing_optional))

    if missing_required:
        raise SystemExit(
            'Required local/uploaded image assets are missing: ' + ', '.join(missing_required)
        )

    return replacements


def find_external_runtime_urls(root: Path) -> list[str]:
    """Check only the shipped Phaser runtime for external image/font asset URLs."""
    matches: list[str] = []
    if not root.exists():
        return matches

    needles = (
        'image.qwenlm.ai',
        'cdn.jsdelivr.net/fontsource/css',
        'fonts.googleapis.com',
        'fonts.gstatic.com',
    )
    for file in [p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in {'.html', '.js', '.css'}]:
        text = file.read_text(encoding='utf-8', errors='ignore')
        if any(needle in text for needle in needles):
            matches.append(str(file.relative_to(ROOT)))
    return matches


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    image_replacements = materialize_images(manifest.get('images', []))

    for item in manifest.get('fonts', []):
        vendor_font(item['package'], item['css'])

    # The old monolithic runtime has been removed from the production repository.
    # Keep these guarded hooks so the materializer remains harmless on archived or
    # rollback branches where the legacy paths may still exist.
    legacy_setup = ROOT / 'src/js/modules/01-setup.js'
    legacy_game = ROOT / 'src/game.html'
    if legacy_setup.is_file():
        patch_file(legacy_setup, image_replacements)
    if legacy_game.is_file():
        patch_file(legacy_game, image_replacements)
        patch_file(legacy_game, {
            'https://cdn.jsdelivr.net/fontsource/css/press-start-2p@latest/index.css': '../assets/fonts/press-start-2p/400.css',
            'https://cdn.jsdelivr.net/fontsource/css/grenze-gotisch@latest/index.css': '../assets/fonts/grenze-gotisch/400.css',
            'https://cdn.jsdelivr.net/fontsource/css/eb-garamond@latest/index.css': '../assets/fonts/eb-garamond/400.css',
            'https://cdn.jsdelivr.net/fontsource/css/unifrakturmaguntia@latest/index.css': '../assets/fonts/unifrakturmaguntia/400.css',
            'https://cdn.jsdelivr.net/fontsource/css/noto-serif-jp@latest/index.css': '../assets/fonts/noto-serif-jp/400.css',
        })

    remaining = find_external_runtime_urls(ROOT / 'phaser')
    if remaining:
        raise SystemExit('External runtime asset URLs remain in shipped Phaser app: ' + ', '.join(remaining))


if __name__ == '__main__':
    main()
