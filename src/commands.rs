use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::PldownloaderExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.pldownloader().ping(payload)
}

#[command]
pub(crate) async fn download_private<R: Runtime>(
    app: AppHandle<R>,
    payload: DownloadPrivateRequest,
) -> Result<DownloadResponse> {
    app.pldownloader().download_private(payload)
}

#[command]
pub(crate) async fn download_public<R: Runtime>(
    app: AppHandle<R>,
    payload: DownloadPublicRequest,
) -> Result<DownloadResponse> {
    app.pldownloader().download_public(payload)
}
