import express from "express";
import dotenv from "dotenv";
dotenv.config();
import gitRoutes from "./api/routes/git";
// import githubRoutes from "./api/routes/github";
const app = express();
app.use(express.json());

app.use("/api/git", gitRoutes);
// app.use("/github", githubRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
