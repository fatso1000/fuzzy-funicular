export const branchPostfixes = ["", "-develop", "-testing"];
export const originBranches = ["main", "develop", "testing"];

export default function getInitialBranchesName(branchName: string): string[] {
  return branchPostfixes.map((postfix) => `${branchName}${postfix}`);
}
