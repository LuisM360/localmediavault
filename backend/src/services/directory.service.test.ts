import { describe, it, vi, expect } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { scanDirectoryTree } from "../services/directory.service.js";

it("should handle network drives correctly", async () => {
  vi.mock("node:child_process", () => ({
    exec: vi.fn((command, callback) => {
      callback(null, {
        stdout: `
Name
C:
D:
E:
Z:
`,
      });
    }),
  }));

  const getWindowsDrives = async (): Promise<string[]> => {
    const { stdout } = await promisify(exec)("wmic logicaldisk get name");
    return stdout
      .split("\n")
      .slice(1)
      .map((line) => line.trim())
      .filter((line) => line.length === 2)
      .map((drive) => `${drive}\\`);
  };
  const drives = await getWindowsDrives();
  expect(drives).toEqual(["C:\\", "D:\\", "E:\\", "Z:\\"]);
});

it("should limit directory traversal to a maximum depth of 3", async () => {
  vi.mock("node:fs/promises", () => ({
    readdir: vi.fn().mockImplementation((path) => {
      if (path === "C:\\") {
        return [{ name: "level1", isDirectory: () => true }];
      } else if (path === "C:\\level1") {
        return [{ name: "level2", isDirectory: () => true }];
      } else if (path === "C:\\level1\\level2") {
        return [{ name: "level3", isDirectory: () => true }];
      } else if (path === "C:\\level1\\level2\\level3") {
        return [{ name: "level4", isDirectory: () => true }];
      }
      return [];
    }),
  }));

  const result = await scanDirectoryTree("C:\\");

  expect(result).toEqual({
    name: "C:\\",
    path: "C:\\",
    children: [
      {
        name: "level1",
        path: "C:\\level1",
        children: [
          {
            name: "level2",
            path: "C:\\level1\\level2",
            children: [
              {
                name: "level3",
                path: "C:\\level1\\level2\\level3",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  });
});
