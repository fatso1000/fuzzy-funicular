export const branchPostfixes = ["", "-develop", "-testing"];
export const originBranches = ["main", "develop", "testing"];

export default function getInitialBranchesName(branchName: string): string[] {
  return branchPostfixes.map((postfix) => `${branchName}${postfix}`);
}

/**
 * Rotates and optionally filters two parallel arrays so that `defaultBranch` is first.
 *
 * @param branchName - Used to derive branchPostfixes from your naming logic
 * @param defaultBranch - The branch to move to the beginning
 * @param includeOnly - (optional) list of branches you want to include in the result
 */
export function rotateBranches(
  branchName: string,
  defaultBranch: string,
  includeOnly?: string[]
): { originBranches: string[]; branchPostfixes: string[] } {
  const branchPostfixes = getInitialBranchesName(branchName);

  // Filter branches and postfixes based on includeOnly
  let filtered: Array<{ branch: string; postfix: string }> = originBranches.map((branch, i) => ({
    branch,
    postfix: branchPostfixes[i],
  }));

  if (includeOnly) {
    filtered = filtered.filter((entry) => includeOnly.includes(entry.branch));
  }

  const idx = filtered.findIndex((entry) => entry.branch === defaultBranch);
  if (idx === -1) {
    // if defaultBranch not found in filtered set
    return {
      originBranches: filtered.map((e) => e.branch),
      branchPostfixes: filtered.map((e) => e.postfix),
    };
  }

  const rotated = filtered.slice(idx).concat(filtered.slice(0, idx));
  return {
    originBranches: rotated.map((e) => e.branch),
    branchPostfixes: rotated.map((e) => e.postfix),
  };
}
