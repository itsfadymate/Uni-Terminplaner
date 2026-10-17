import type { DriveFile } from '../types';

/**
 * Service to interact with Google Drive through a Google Apps Script proxy.
 * 
 * The proxy URL should point to a deployed Google Apps Script Web App
 * that lists files in a Drive folder and can also serve file content as base64.
 * 
 * See apps-script/Code.gs for the proxy implementation.
 */

const CACHE_KEY = 'giu_schedule_drive_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  files: DriveFile[];
  timestamp: number;
}

/**
 * Fetch the list of PDF files from the Google Drive folder via the proxy.
 */
export async function fetchDriveFiles(proxyUrl: string, folderId: string): Promise<DriveFile[]> {
  // Check cache first
  const cached = getCachedFiles();
  if (cached) return cached;

  const url = `${proxyUrl}?action=list&folderId=${encodeURIComponent(folderId)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file list: ${response.statusText}`);
  }

  const files: DriveFile[] = await response.json();
  
  // Filter to PDF files only
  const pdfFiles = files.filter(
    (f) => f.mimeType === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
  );

  // Cache the result
  cacheFiles(pdfFiles);

  return pdfFiles;
}

/**
 * Fetch a PDF file's content as an ArrayBuffer via the proxy.
 */
export async function fetchPdfContent(proxyUrl: string, fileId: string): Promise<ArrayBuffer> {
  const url = `${proxyUrl}?action=download&fileId=${encodeURIComponent(fileId)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.statusText}`);
  }

  // The proxy returns the PDF as base64-encoded text
  const base64 = await response.text();
  
  // Convert base64 to ArrayBuffer
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return bytes.buffer;
}

function getCachedFiles(): DriveFile[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return cached.files;
  } catch {
    return null;
  }
}

function cacheFiles(files: DriveFile[]): void {
  try {
    const data: CachedData = { files, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // Session storage might be full or unavailable
  }
}
