import { invoke } from '@tauri-apps/api/core'

export async function ping(value: string): Promise<string | null> {
  return await invoke<{ value?: string }>('plugin:pldownloader|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

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
  path?: string;
  uri?: string;
}

export async function downloadPrivate(payload: DownloadPrivateRequest): Promise<DownloadResponse> {
  return await invoke<DownloadResponse>('plugin:pldownloader|download_private', { payload })
}

export async function downloadPublic(payload: DownloadPublicRequest): Promise<DownloadResponse> {
  return await invoke<DownloadResponse>('plugin:pldownloader|download_public', { payload })
}

export async function copyFilePath(src: string, dest: string): Promise<string> {
  return await invoke<string>('plugin:pldownloader|copy_file_path', { src, dest })
}
