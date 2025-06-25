export const branchPostfixes = ["", "-develop", "-testing"];
export const originBranches = ["main", "develop", "testing"];

export default function getInitialBranchesName(branchName: string): string[] {
  return branchPostfixes.map((postfix) => `${branchName}${postfix}`);
}

/**
 * Rotates two parallel arrays so that `defaultBranch` is first.
 * @param originBranches  e.g. ["main","develop","testing"]
 * @param branchPostfixes e.g. ["","-develop","-testing"]
 * @param defaultBranch   e.g. "develop"
 */
export function rotateBranches(
  branchName: string,
  defaultBranch: string
): { originBranches: string[]; branchPostfixes: string[] } {
  const idx = originBranches.indexOf(defaultBranch);
  if (idx === -1) {
    // if not found, return arrays unchanged
    return { originBranches, branchPostfixes };
  }

  const rotate = <T>(arr: T[]) => arr.slice(idx).concat(arr.slice(0, idx));

  return {
    originBranches: rotate(originBranches),
    branchPostfixes: rotate(getInitialBranchesName(branchName)),
  };
}
