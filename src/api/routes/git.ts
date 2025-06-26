import { Router } from "express";
import {
  addAndCommit,
  addAndCommitToBranches,
  checkoutToDefault,
  createInitialBranches,
  currentRepo,
  getCurrentBranch,
  pruneLocalBranches,
} from "../services/gitService";
import { returnErrorMessage } from "../../helper/errorHandler";
import { sendSuccess } from "../../helper/sendResponse";
import { originBranches } from "../../helper/branches";

const router = Router();

router.get("/repo", async (req, res) => {
  try {
    const repo = await currentRepo();
    sendSuccess(res, {
      message: "...",
      data: { repo },
    });
  } catch (err) {
    returnErrorMessage(err, res);
  }
});

router.post("/commit", async (req, res) => {
  try {
    const { message, branchName, stageAll } = req.body;
    await addAndCommit(branchName, message, stageAll);
    sendSuccess(res, {
      message: "...",
      data: {},
    });
  } catch (err) {
    returnErrorMessage(err, res);
  }
});

router.post("/commit-cherry-all", async (req, res) => {
  try {
    const { message, branchName, defaultBranch, stageAll, includeOnly } = req.body;
    const currentBranch =
      originBranches.find((branch) => defaultBranch === branch) ?? (await getCurrentBranch());
    await addAndCommitToBranches(branchName, message, currentBranch, stageAll, includeOnly);
    sendSuccess(res, {
      message: "...",
      data: {},
    });
  } catch (err) {
    returnErrorMessage(err, res);
  }
});

router.post("/branches-creation", async (req, res) => {
  try {
    const {
      branchName,
      defaultBranch,
      includeOnly,
    }: { branchName: string; defaultBranch: string | undefined; includeOnly?: string[] } = req.body;
    const currentBranch =
      originBranches.find((branch) => defaultBranch === branch) ?? (await getCurrentBranch());
    if (!originBranches.includes(currentBranch)) await checkoutToDefault("main");
    await createInitialBranches(branchName, currentBranch, includeOnly);
    await checkoutToDefault(currentBranch);
    sendSuccess(res, {
      message: "...",
      data: {},
    });
  } catch (error) {
    returnErrorMessage(error, res);
  }
});

router.delete("/branches-all", async (req, res) => {
  try {
    await pruneLocalBranches();
    sendSuccess(res, {
      message: "...",
      data: {},
    });
  } catch (err) {
    returnErrorMessage(err, res);
  }
});

export default router;
