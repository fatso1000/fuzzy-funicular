import express from "express";
import dotenv from "dotenv";
import gitRoutes from "./api/routes/git";
// import githubRoutes from "./api/routes/github";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/git", gitRoutes);
// app.use("/github", githubRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
