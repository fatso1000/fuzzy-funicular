import { Router } from "express";
import {
  addAndCommit,
  addAndCommitToBranches,
  checkoutToDefault,
  createInitialBranches,
  getCurrentBranch,
  pruneLocalBranches,
} from "../services/gitService";
import { returnErrorMessage } from "../../helper/errorHandler";
import { sendSuccess } from "../../helper/sendResponse";
import { originBranches } from "../../helper/branches";

const router = Router();

router.post("/commit", async (req, res) => {
  try {
    const { message, branchName } = req.body;
    await addAndCommit(branchName, message);
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
    const { message, branchName, defaultBranch } = req.body;
    const currentBranch =
      originBranches.find((branch) => defaultBranch === branch) ?? (await getCurrentBranch());
    await addAndCommitToBranches(branchName, message, currentBranch);
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
    // AGREGAR RAMAS A CREAR, POR EJEMPLO, SOLO CREAR `develop` O `testing`
    const {
      branchName,
      defaultBranch,
      selectedBranches,
    }: { branchName: string; defaultBranch: string | undefined; selectedBranches: string[] } =
      req.body;
    const currentBranch =
      originBranches.find((branch) => defaultBranch === branch) ?? (await getCurrentBranch());
    if (!originBranches.includes(currentBranch)) await checkoutToDefault("main");
    await createInitialBranches(branchName, currentBranch);
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
