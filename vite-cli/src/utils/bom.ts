/**
 * 下载文件
 * @param blob 
 * @param filename 
 */
export function downloadFile(blob: Blob | File, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
