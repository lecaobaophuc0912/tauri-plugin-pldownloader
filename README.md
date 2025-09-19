# Tauri Plugin PLDownloader

A Tauri plugin for cross-platform file downloading with a unified API for Android and iOS. It supports public downloads (visible to users in Photos/Files) and private downloads (stored in app sandbox for internal use or sharing via share sheet).

[![Crates.io](https://img.shields.io/crates/v/tauri-plugin-pldownloader)](https://crates.io/crates/tauri-plugin-pldownloader)
[![Crates.io](https://img.shields.io/crates/d/tauri-plugin-pldownloader)](https://crates.io/crates/tauri-plugin-pldownloader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Platform Support

| Platform | Status           | Notes                                                |
| -------- | ---------------- | ---------------------------------------------------- |
| iOS      | ✅ Full          | Save to Photos (media) or Files (non-media)          |
| Android  | ✅ Full          | MediaStore (public) and app external files (private) |
| macOS    | ❌ Not supported | Not supported yet                                    |
| Windows  | ❌ Not supported | Not supported yet                                    |
| Linux    | ❌ Not supported | Not supported yet                                    |

## Features

- Public and private downloads with the same API on Android/iOS
- Auto-detect media (image/video) and save to Photos (iOS) or MediaStore (Android)
- Auto file naming with collision avoidance and extension preservation
- Returns path/URI after download for opening/sharing

## Installation

### Rust Dependencies

Add to your app `Cargo.toml`:

```toml
[dependencies]
tauri-plugin-pldownloader = "0.1.0"
```

Or use `cargo add`:

```bash
cargo add tauri-plugin-pldownloader
```

### JavaScript/TypeScript Dependencies

(If you publish a separate guest-js package) install the client API:

```bash
npm install tauri-plugin-pldownloader-api
# or
yarn add tauri-plugin-pldownloader-api
```

Or call commands directly using `@tauri-apps/api` `invoke` (see API section).

## Usage

### Rust Setup


In your app `src-tauri/src/lib.rs`:

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_pldownloader::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### JavaScript/TypeScript Usage

If you use helpers from `tauri-plugin-pldownloader-api`:

```typescript
import {
  downloadPrivate,
  downloadPublic,
  ping,
  copyFilePath,
} from "tauri-plugin-pldownloader-api";

// Ping
const echo = await ping("hello");

// Private download (stored in sandbox, not visible in Files/Photos)
const r1 = await downloadPrivate({
  url: "https://example.com/file.pdf",
  fileName: "document.pdf", // optional
});
// r1 => { fileName: 'document.pdf', path: '/var/mobile/.../Application Support/Downloads/document.pdf' }

// Public download
// - Media (image/video): save to Photos, return uri = localIdentifier
// - Non-media (pdf, docx, xlsx...): save to Files (On My iPhone > <AppName>)
const r2 = await downloadPublic({
  url: "https://example.com/cat.jpg",
  fileName: "cat.jpg", // optional
  mimeType: "image/jpeg", // optional (helps accurate media detection)
});
// r2 media => { fileName: 'cat.jpg', uri: 'XXXXXXXX-XXXX...' }
// r2 non-media => { fileName: 'report.xlsx', path: '/var/mobile/.../Documents/<AppName>/report.xlsx' }

// Copy file from A to B (desktop/mobile)
const destPath = await copyFilePath(
  "/path/src/file.pdf",
  "/path/dest/file.pdf"
);
```

If you want to call `invoke` yourself:

```typescript
import { invoke } from "@tauri-apps/api/core";

await invoke("plugin:pldownloader|download_public", {
  payload: { url, fileName, mimeType },
});
await invoke("plugin:pldownloader|download_private", {
  payload: { url, fileName },
});
```

## API Reference

### TypeScript types

```ts
export interface DownloadPrivateRequest {
  url: string;
  fileName?: string;
}

export interface DownloadPublicRequest {
  url: string;
  fileName?: string;
  mimeType?: string;
}

export interface DownloadResponse {
  fileName: string;
  path?: string; // When saved to Files/sandbox
  uri?: string; // When saved to Photos (iOS) or a MediaStore URI (Android if applicable)
}
```

### Commands

- `ping(value: string): Promise<string | null>`

  - Verify plugin connectivity.

- `downloadPrivate(payload: DownloadPrivateRequest): Promise<DownloadResponse>`

  - iOS: downloads to `Application Support/Downloads` (sandbox, not visible in Files/Photos). Returns `path`.
  - Android: downloads to app private external directory (Downloads or files dir). Returns `path`.
  - Use cases: store files temporarily for share sheet or internal opening.

- `downloadPublic(payload: DownloadPublicRequest): Promise<DownloadResponse>`

  - iOS:
    - Media (image/video): saves to Photos via `PHPhotoLibrary`, returns `uri` (localIdentifier).
    - Non-media (pdf, docx, xlsx, zip...): saves to `Documents/<AppName>/`, visible in Files (On My iPhone), returns `path`.
  - Android:
    - Saves to MediaStore (Downloads/<AppName>) with mime-type, returns `uri`.
  - Use cases: download files intended for user visibility and management (Photos/Files/Downloads).

- `copyFilePath(src: string, dest: string): Promise<string>`
  - Utility to copy files between known paths (e.g., from sandbox to Documents).

## Use Cases

- Save snapshots/exported images: use `downloadPublic` with an image `mimeType` to save directly to Photos.
- Download documents (PDF, DOCX, XLSX) for users: `downloadPublic` (non-media) → appears in Files.
- Store internal files to share/open later: `downloadPrivate` then use the returned `path` for the share sheet.

## iOS – Info.plist Notes (Required/Recommended)

- Required to save media to Photos:

```xml
<key>NSPhotoLibraryAddUsageDescription</key>
<string>We need access to your photo library to save the downloaded file.</string>
```

- Recommended to make the app folder visible in Files (especially on Simulator):

```xml
<key>UIFileSharingEnabled</key>
<true/>
<key>LSSupportsOpeningDocumentsInPlace</key>
<true/>
```

## Android – Notes

- The plugin uses `MediaStore` to save to public Downloads; no write permission needed on Android 10+.
- On older devices (Android 9 and below), storage permission may be required. For most modern target SDKs, no extra app action is needed if only saving to MediaStore.

## Development

### Prerequisites

- Rust 1.77.2+
- Tauri 2.7.0+
- Xcode (iOS) / Android Studio (Android)

### Building

```bash
# Build Rust plugin
cargo build

# Build JavaScript/TypeScript client (if applicable)
yarn build
```

### Testing

```bash
# Run Rust tests
cargo test

# Run example app
cd examples/tauri-app
cargo tauri dev
```

## Known Notes

- iOS Photos save error 3302: handled internally by persisting the temp file before calling `PHPhotoLibrary`. Ensure `NSPhotoLibraryAddUsageDescription` is present.
- On Simulator, the app folder in Files may be hidden unless the two keys above are present.

## Contributing

PRs are welcome!

## License

MIT – see [LICENSE](LICENSE).
