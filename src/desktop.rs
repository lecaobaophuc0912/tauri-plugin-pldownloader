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

  pub fn save_file_private_from_buffer(&self, payload: SaveFilePrivateFromBufferRequest) -> crate::Result<DownloadResponse> {
    use std::path::Path;
    use tauri::api::path::app_data_dir;
    
    // Get the app data directory for private files
    let app_data = app_data_dir(&self.0.config().tauri.bundle.identifier)
      .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "App data directory not found"))?;
    
    // Create the private directory if it doesn't exist
    let private_dir = app_data.join("private");
    std::fs::create_dir_all(&private_dir)?;
    
    // Create the file path
    let file_path = private_dir.join(&payload.file_name);
    
    // Write the data to the file
    std::fs::write(&file_path, &payload.data)?;
    
    Ok(DownloadResponse {
      file_name: payload.file_name,
      path: Some(file_path.to_string_lossy().to_string()),
      uri: None,
    })
  }

  pub fn save_file_public_from_buffer(&self, payload: SaveFilePublicFromBufferRequest) -> crate::Result<DownloadResponse> {
    use std::path::Path;
    use tauri::api::path::download_dir;
    
    // Get the downloads directory for public files
    let downloads_dir = download_dir()
      .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Downloads directory not found"))?;
    
    // Create the file path
    let file_path = downloads_dir.join(&payload.file_name);
    
    // Write the data to the file
    std::fs::write(&file_path, &payload.data)?;
    
    Ok(DownloadResponse {
      file_name: payload.file_name,
      path: Some(file_path.to_string_lossy().to_string()),
      uri: None,
    })
  }
}
