import simpleGit from "simple-git";
import getInitialBranchesName, { rotateBranches } from "../../helper/branches";

const git = simpleGit({ baseDir: process.cwd() });

export async function addCommitAndPush(branchName: string, message: string) {
  // 🟡 REVISAR A FUTURO, OPTAR POR OPTIONAL ADD
  await git.add(".");
  await git.commit(message);
  await pushOrigin(branchName);
  console.log(`Added, commited and pushed to: ${branchName}, created at: ${new Date().getTime()}`);
}

export async function addAndCommit(branchName: string, message: string) {
  // 🟡 REVISAR A FUTURO, OPTAR POR OPTIONAL ADD
  await git.add(".");
  await git.commit(message);
  console.log(`Added and commited to: ${branchName}, created at: ${new Date().getTime()}`);
}

export async function cherryPick(branchName: string) {
  const log = await git.log({ n: 1 });
  const lastHash = log.latest?.hash;
  if (!lastHash) throw new Error(`No commits found on ${branchName}`);

  await git.checkout(branchName);
  await git.raw(["cherry-pick", lastHash]);
  console.log(
    `✅ Cherry-picked ${lastHash} into ${branchName}, created at: ${new Date().getTime()}`
  );
}

export async function cherryPickAndPush(branchName: string) {
  const log = await git.log({ n: 1 });
  const lastHash = log.latest?.hash;
  if (!lastHash) throw new Error(`No commits found on ${branchName}`);

  await git.checkout(branchName);
  await git.raw(["cherry-pick", lastHash]);
  await pushOrigin(branchName);
  console.log(
    `✅ Cherry-picked and pushed ${lastHash} into ${branchName}, created at: ${new Date().getTime()}`
  );
}

export async function addAndCommitToBranches(
  branchName: string,
  commitMessage: string,
  defaultBranch: string
) {
  const { branchPostfixes } = rotateBranches(branchName, defaultBranch);
  for (const [index, branch] of branchPostfixes.entries()) {
    if (index > 0) await cherryPick(branch);
    else await addAndCommit(branch, commitMessage);
  }
}

export async function addCommitAndPushToBranches(branchName: string, commitMessage: string) {
  const initalBranches = getInitialBranchesName(branchName);
  for (const branch of initalBranches) {
    await addCommitAndPush(branch, commitMessage);
  }
}

export async function pushOrigin(branchName: string) {
  await git.push("origin", branchName);
}

export async function pullOrigin(branchName: string) {
  const pull = await git.pull("origin", branchName);
  return pull;
}

export async function createInitialBranches(branchName: string, defaultBranch = "main") {
  const { branchPostfixes, originBranches } = rotateBranches(branchName, defaultBranch);
  for (const [index, branch] of branchPostfixes.entries()) {
    await git.checkout(originBranches[index]);
    await pullOrigin(originBranches[index]);
    await git.checkoutLocalBranch(branch);
    console.log(`Branch created: ${branch}, created at: ${new Date().getTime()}`);
  }
}

export async function checkoutToDefault(branchName: string) {
  await git.checkout(branchName);
}

export async function getCurrentBranch() {
  const branchSummary = await git.branch();
  // branchSummary.current is the name of the current branch
  return branchSummary.current;
}

/**
 * Deletes all local branches except those in keepList.
 */
export async function pruneLocalBranches(keepList: string[] = ["main", "develop", "testing"]) {
  // 1. Get local branches
  const { all: localBranches, current } = await git.branchLocal();

  // 2. Ensure we’re on a kept branch
  if (!keepList.includes(current)) {
    await git.checkout(keepList[0]);
  }

  // 3. Delete every branch not in keepList
  for (const branch of localBranches) {
    if (keepList.includes(branch)) continue;

    console.log(`Deleting local branch: ${branch}`);
    // 'true' = force delete (unmerged)
    await git.deleteLocalBranch(branch, true).catch((err) => {
      console.warn(`  • Could not delete ${branch}: ${err.message}`);
    });
  }

  console.log("Local prune complete.");
}
