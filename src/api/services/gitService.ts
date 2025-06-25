import simpleGit from "simple-git";
import getInitialBranchesName, { originBranches } from "../../helper/branches";

const git = simpleGit({ baseDir: process.cwd() });

export async function addCommitAndPush(branchName: string, message: string) {
  await git.add("./*");
  await git.commit(message);
  await pushOrigin(branchName);
  console.log(`Added, commited and pushed to: ${branchName}, created at: ${new Date().getTime()}`);
}

export async function addAndCommit(branchName: string, message: string) {
  await git.add("./*");
  await git.commit(message);
  console.log(`Added and commited to: ${branchName}, created at: ${new Date().getTime()}`);
}

export async function addAndCommitToBranches(branchName: string, commitMessage: string) {
  const initalBranches = getInitialBranchesName(branchName);
  for (const branch of initalBranches) {
    addAndCommit(branch, commitMessage);
  }
}

export async function addCommitAndPushToBranches(branchName: string, commitMessage: string) {
  const initalBranches = getInitialBranchesName(branchName);
  for (const branch of initalBranches) {
    addCommitAndPush(branch, commitMessage);
  }
}

export async function pushOrigin(branchName: string) {
  await git.push("origin", branchName);
}

export async function pullOrigin(branchName: string) {
  const pull = await git.pull("origin", branchName);
  return pull;
}

export async function createInitialBranches(branchName: string) {
  const initalBranches = getInitialBranchesName(branchName);
  for (const [index, branch] of initalBranches.entries()) {
    await git.checkout(originBranches[index]);
    await pullOrigin(originBranches[index]);
    await git.checkoutLocalBranch(branch);
    console.log(`Branch created: ${branch}, created at: ${new Date().getTime()}`);
  }
}

export async function checkoutToDefault(branchName: string) {
  await git.checkout(branchName);
}
