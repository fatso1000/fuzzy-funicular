import { Router } from "express";
import { addAndCommit, checkoutToDefault, createInitialBranches } from "../services/gitService";
import { returnErrorMessage } from "../../helper/errorHandler";
import { sendSuccess } from "../../helper/sendResponse";

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

router.post("/branches-creation", async (req, res) => {
  try {
    const { branchName, defaultBranch } = req.body;
    await createInitialBranches(branchName);
    if (defaultBranch) await checkoutToDefault(defaultBranch);
    sendSuccess(res, {
      message: "...",
      data: {},
    });
  } catch (error) {
    returnErrorMessage(error, res);
  }
});

export default router;
