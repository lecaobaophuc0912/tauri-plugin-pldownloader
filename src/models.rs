use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingRequest {
  pub value: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PingResponse {
  pub value: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadPrivateRequest {
  pub url: String,
  pub file_name: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadPublicRequest {
  pub url: String,
  pub file_name: Option<String>,
  pub mime_type: Option<String>,
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DownloadResponse {
  pub file_name: String,
  pub path: Option<String>,
  pub uri: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFilePrivateFromBufferRequest {
  /// ArrayBuffer data to save
  pub data: Vec<u8>,
  pub file_name: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveFilePublicFromBufferRequest {
  /// ArrayBuffer data to save
  pub data: Vec<u8>,
  pub file_name: String,
  pub mime_type: Option<String>,
}
