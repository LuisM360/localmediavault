import { readdir } from "node:fs/promises";
import { join, normalize } from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

interface DirectoryInfo {
  name: string;
  path: string;
}

export class DirectoryService {
  /**
   * Normalizes a Windows path to use backslashes
   */
  private normalizePath(path: string): string {
    // First replace all forward slashes with backslashes
    const normalized = path.replace(/\//g, "\\");
    // Then normalize the path to handle any .. or . segments
    return normalize(normalized);
  }

  /**
   * Retrieves a list of available Windows drives.
   *
   * @returns A list of available Windows drives.
   * @throws An error if retrieval fails.
   */
  async getWindowsDrives(): Promise<string[]> {
    try {
      const { stdout } = await execAsync("wmic logicaldisk get name");
      return stdout
        .split("\n")
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.length === 2);
    } catch (error) {
      throw new Error("Failed to get Windows drives");
    }
  }

  /**
   * Scans a directory for its subdirectories.
   *
   * @param path The path to the directory to scan.
   * @returns A list of subdirectories.
   * @throws An error if the directory cannot be scanned.
   */
  async scanDirectory(path: string): Promise<DirectoryInfo[]> {
    try {
      const normalizedPath = this.normalizePath(path);
      const entries = await readdir(normalizedPath, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((dir) => ({
          name: dir.name,
          path: this.normalizePath(join(normalizedPath, dir.name)),
        }));
    } catch (error) {
      throw new Error(`Failed to scan directory: ${path}`);
    }
  }
}
