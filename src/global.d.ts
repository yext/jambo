declare module 'file-system' {
  type RecurseSyncCallback = (filePath: string, relativePath: string, filename: string) => void;
  export function recurseSync(directoryPath: string, callback: RecurseSyncCallback): string;
}