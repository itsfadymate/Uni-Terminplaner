/**
 * Google Apps Script Proxy for GIU Schedule Manager
 * ==================================================
 * 
 * This script acts as a CORS-free proxy between the React frontend
 * and Google Drive. It can:
 *   1. List PDF files in a Google Drive folder
 *   2. Download a PDF file's content as base64
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com and create a new project
 * 2. Replace the default Code.gs content with this entire file
 * 3. Click Deploy > New deployment
 * 4. Choose type: "Web app"
 * 5. Set "Execute as": Me (your Google account)
 * 6. Set "Who has access": Anyone
 * 7. Click Deploy
 * 8. Copy the Web App URL (ends with /exec)
 * 9. Paste it into the GIU Schedule Manager settings
 * 
 * UPDATING THE DRIVE FOLDER LINK:
 * When the Drive folder link changes, simply update the folder ID
 * in the Schedule Manager settings. No code changes needed.
 */

function doGet(e) {
  var action = e.parameter.action || 'list';
  var output;
  
  try {
    if (action === 'list') {
      output = listFiles(e.parameter.folderId);
    } else if (action === 'download') {
      output = downloadFile(e.parameter.fileId);
    } else {
      output = JSON.stringify({ error: 'Unknown action: ' + action });
    }
  } catch (err) {
    output = JSON.stringify({ error: err.toString() });
  }
  
  // Return with CORS headers
  return ContentService
    .createTextOutput(output)
    .setMimeType(
      action === 'download'
        ? ContentService.MimeType.TEXT
        : ContentService.MimeType.JSON
    );
}

/**
 * List all PDF files in a Google Drive folder.
 * Returns JSON array of file objects.
 */
function listFiles(folderId) {
  if (!folderId) {
    throw new Error('Missing folderId parameter');
  }
  
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var fileList = [];
  
  while (files.hasNext()) {
    var file = files.next();
    var mimeType = file.getMimeType();
    
    // Only include PDF files
    if (mimeType === 'application/pdf' || file.getName().toLowerCase().endsWith('.pdf')) {
      fileList.push({
        id: file.getId(),
        name: file.getName(),
        mimeType: mimeType,
        size: file.getSize(),
        url: file.getUrl(),
        lastUpdated: file.getLastUpdated().toISOString()
      });
    }
  }
  
  // Sort by name
  fileList.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });
  
  return JSON.stringify(fileList);
}

/**
 * Download a file's content as base64.
 * Returns raw base64 string.
 */
function downloadFile(fileId) {
  if (!fileId) {
    throw new Error('Missing fileId parameter');
  }
  
  var file = DriveApp.getFileById(fileId);
  var blob = file.getBlob();
  var base64 = Utilities.base64Encode(blob.getBytes());
  
  return base64;
}

/**
 * Test function - run this in the Apps Script editor to verify it works.
 * Replace the folder ID with your actual folder ID.
 */
function testListFiles() {
  var result = listFiles('1n2n3ILYgJ-oBmC-7v9R6250uCpnjI4_5');
  Logger.log(result);
}
