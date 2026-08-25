# 🚀 Counter Fresh — Release Procedure

This document outlines the standard operating procedure for packaging and
publishing releases for **Counter Fresh**.

---

## 1. Pre-Release Validation

Before cutting a release, verify that the local codebase is clean and passes all
automated checks:

```bash
# 1. Format, lint, and typecheck
deno fmt --check . && deno lint . && deno check

# 2. Run unit and integration tests
deno task test
```

_Do not proceed if any check fails._

---

## 2. Version Bump

Determine the next version number following
[Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`):

- **Patch** (`0.0.1`): Bug fixes, minor visual tweaks.
- **Minor** (`0.1.0`): New features, backward-compatible updates.
- **Major** (`1.0.0`): Breaking changes, major overhauls.

Update the `"version"` field in `deno.json`:

```json
{
  "name": "counter-fresh",
  "version": "0.1.0"
}
```

---

## 3. Commit and Tag

Stage your changes, commit, and create an annotated git tag:

```bash
# Commit version bump
git add deno.json deno.lock
git commit -m "chore: release v0.1.0"
git push origin main

# Create the annotated version tag
git tag -a v0.1.0 -m "Release v0.1.0"

# Push the tag to trigger the GitHub Actions release workflow
git push origin v0.1.0
```

---

## 4. Automated CI Build & Publishing

Once the tag is pushed, GitHub Actions automatically executes the
`.github/workflows/release.yml` pipeline:

1. **Multi-OS Build Matrix**:
   - 🐧 **Linux (`ubuntu-latest`)**: Builds
     `CounterFresh-v<version>-linux-x64.tar.gz`
   - 🍎 **macOS (`macos-latest`)**: Builds
     `CounterFresh-v<version>-macos-arm64.zip`
   - 🪟 **Windows (`windows-latest`)**: Builds
     `CounterFresh-v<version>-windows-x64.zip`
2. **Release Notes**: Automatically generates release notes from merged PRs and
   commit history.
3. **Asset Publishing**: Attaches all three binaries to the new GitHub Release.

> **Monitor the build:** Go to your repository on GitHub $\rightarrow$
> **Actions** tab to watch the build matrix run.

---

## 5. Post-Release Verification

After GitHub Actions finishes:

1. Go to **GitHub $\rightarrow$ Releases $\rightarrow$ `v0.1.0`**.
2. Verify all three platform assets are attached:
   - `CounterFresh-v0.1.0-linux-x64.tar.gz`
   - `CounterFresh-v0.1.0-macos-arm64.zip`
   - `CounterFresh-v0.1.0-windows-x64.zip`
3. Download the archive for your operating system and verify it launches
   cleanly.

---

## 🛠️ Fallback: Manual Local Packaging

If you ever need to build and package locally without GitHub Actions:

### 🐧 Linux:

```bash
deno task d-build
tar -czvf CounterFresh-v0.1.0-linux-x64.tar.gz -C dist counter-fresh
```

### 🍎 macOS:

```bash
deno task d-build
cd dist && zip -r -y ../CounterFresh-v0.1.0-macos-arm64.zip CounterFresh.app && cd ..
```

### 🪟 Windows (PowerShell):

```powershell
deno task d-build
Compress-Archive -Path dist/CounterFresh -DestinationPath CounterFresh-v0.1.0-windows-x64.zip
```

---

## ⚠️ Emergency Hotfix / Tag Retraction

If you accidentally tag a broken commit:

```bash
# 1. Delete the local tag
git tag -d v0.1.0

# 2. Delete the remote tag on GitHub
git push origin :refs/tags/v0.1.0

# 3. Delete the draft/release from the GitHub Releases page
# 4. Fix the issue, re-tag, and push again
```
