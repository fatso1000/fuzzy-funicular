import simpleGit, { SimpleGit } from "simple-git";
import path from "path";

/**
 * Create a simple-git instance for a specific repo path.
 * Defaults to current working dir.
 */
export default function getGitClient(repoPath?: string): SimpleGit {
  repoPath = process.env.REPO_PATH;
  return simpleGit({
    baseDir: repoPath ? path.resolve(repoPath) : process.cwd(),
  });
}
