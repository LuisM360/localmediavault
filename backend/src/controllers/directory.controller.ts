import type { Context } from "hono";
import { DirectoryService } from "../services/directory.service.js";

const directoryService = new DirectoryService();

/**
 * Normalizes a drive path by ensuring it ends with a backslash when it's a root drive
 */
function normalizeDrivePath(path: string): string {
  return path.endsWith(":") ? `${path}\\` : path;
}

/**
 * Handles the HTTP request to retrieve a list of available drives.
 *
 * @param c - The context object provided by the Hono framework, representing the request and response.
 * @returns A JSON response containing the list of available drives or an error message with status code 500 if retrieval fails.
 */

export async function getDrives(c: Context) {
  try {
    const drives = await directoryService.getWindowsDrives();
    return c.json({ drives });
  } catch (error) {
    return c.json({ error: "Failed to get drives" }, 500);
  }
}

/**
 * Handles the HTTP request to retrieve a list of subdirectories for a given drive.
 *
 * @param c - The context object provided by the Hono framework, representing the request and response.
 * @returns A JSON response containing the list of subdirectories or an error message with status code 500 if scanning fails.
 */
export async function getDriveContents(c: Context) {
  const drive = c.req.param("drive");
  const drivePath = normalizeDrivePath(drive);

  try {
    const directories = await directoryService.scanDirectory(drivePath);
    return c.json({ directories });
  } catch (error) {
    console.error(`Failed to scan drive ${drivePath}:`, error);
    return c.json({ error: `Failed to scan drive ${drivePath}` }, 500);
  }
}

/**
 * Handles the HTTP request to retrieve a list of subdirectories for a specified path.
 *
 * @param c - The context object provided by the Hono framework, representing the request and response.
 * @returns A JSON response containing the list of subdirectories if successful or an error message with a status code if scanning fails or if the path parameter is missing.
 */

export async function getDirectoryContents(c: Context) {
  const path = c.req.query("path");

  if (!path) {
    return c.json({ error: "Path parameter is required" }, 400);
  }

  const normalizedPath = normalizeDrivePath(path);

  try {
    const directories = await directoryService.scanDirectory(normalizedPath);
    return c.json({ directories });
  } catch (error) {
    return c.json({ error: `Failed to scan path ${normalizedPath}` }, 500);
  }
}
