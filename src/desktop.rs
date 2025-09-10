use serde::de::DeserializeOwned;
use tauri::{plugin::PluginApi, AppHandle, Runtime};

use crate::models::*;

pub fn init<R: Runtime, C: DeserializeOwned>(
  app: &AppHandle<R>,
  _api: PluginApi<R, C>,
) -> crate::Result<Pldownloader<R>> {
  Ok(Pldownloader(app.clone()))
}

/// Access to the pldownloader APIs.
pub struct Pldownloader<R: Runtime>(AppHandle<R>);

impl<R: Runtime> Pldownloader<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    Ok(PingResponse {
      value: payload.value,
    })
  }

  pub fn download_private(&self, _payload: DownloadPrivateRequest) -> crate::Result<DownloadResponse> {
    Err(std::io::Error::new(std::io::ErrorKind::Unsupported, "download_private not implemented on desktop").into())
  }

  pub fn download_public(&self, _payload: DownloadPublicRequest) -> crate::Result<DownloadResponse> {
    Err(std::io::Error::new(std::io::ErrorKind::Unsupported, "download_public not implemented on desktop").into())
  }
}
