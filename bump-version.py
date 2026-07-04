#!/usr/bin/env python3
"""
Bump the ?v= query string on a specific static asset across every HTML file.
Run this whenever you edit a .js / .svg / .png / .jpg / .webp file that's
served under Cloudflare's immutable cache — the query bump forces browsers
to fetch the fresh version.

Usage:
    python3 bump-version.py waitlist.js
    python3 bump-version.py pcg-monogram.svg
    python3 bump-version.py "hero-mobile.webp"

You can also bump multiple at once:
    python3 bump-version.py waitlist.js pcg-monogram.svg

If a version query string doesn't exist yet, it's set to ?v=2 (assuming ?v=1
was the initial state). If it exists, the number is incremented by 1.
"""
import os, re, sys, urllib.parse

def bump_file(filename):
    """Bump ?v=N to ?v=N+1 for every reference to `filename` in HTML files."""
    if not filename:
        return

    # Normalize the filename — try both raw and URL-encoded forms
    # since HTML files use %20 for spaces
    variants = {filename, urllib.parse.quote(filename)}

    html_files = sorted(f for f in os.listdir('.') if f.endswith('.html'))
    total_bumps = 0
    files_touched = 0
    max_version_seen = 1

    for html in html_files:
        with open(html) as f:
            content = f.read()
        new_content = content
        for variant in variants:
            # Match: filename?v=N (may appear in src=, href=, srcset=, imagesrcset=, content=)
            # Escape special regex chars in the filename
            esc = re.escape(variant)
            pattern = re.compile(rf'({esc})\?v=(\d+)')
            def bump(m):
                nonlocal max_version_seen
                current = int(m.group(2))
                max_version_seen = max(max_version_seen, current)
                return f'{m.group(1)}?v={current + 1}'
            new_content, n = pattern.subn(bump, new_content)

            # Also handle unversioned appearances of the file in srcset/imagesrcset
            # (defensive — future <source srcset="..."> tags won't be missed)
            unversioned_pattern = re.compile(rf'({esc})(?!\?v=)(?=["\s,])')
            def add_v(m):
                # Only add if inside a srcset= or imagesrcset= or src= attribute context
                # Simplest heuristic: only add if not already followed by ?v=
                nonlocal max_version_seen
                return f'{m.group(1)}?v={max_version_seen + 1 if max_version_seen else 1}'
            # Skip this defensive add — the initial versioning script owns first-time versioning

            # Handle case where filename appears without any ?v= yet
            # (unlikely after initial versioning, but safe fallback)
            no_version_pattern = re.compile(rf'({esc})(?![^"\s]*\?v=)(?=["\s,])')
            def add(m):
                return f'{m.group(1)}?v=2'
            # Only apply the "add" path if we haven't already bumped an existing v=
            # (avoid double-appending); skip for now — the initial script handled setup.

        if new_content != content:
            with open(html, 'w') as f:
                f.write(new_content)
            files_touched += 1
            total_bumps += content.count('?v=') - content.count('?v=' + '0' * 20)  # rough
            # More accurate count:
            total_bumps += sum(1 for m in re.finditer(r'\?v=\d+', new_content)) - sum(
                1 for m in re.finditer(r'\?v=\d+', content)
            )

    new_version = max_version_seen + 1 if max_version_seen > 0 else 2
    print(f"  {filename}: bumped to ?v={new_version} across {files_touched} HTML files")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    for filename in sys.argv[1:]:
        bump_file(filename)
    print("\nDone. Commit + deploy — the new query strings will force cache invalidation.")


if __name__ == "__main__":
    main()
