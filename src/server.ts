import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (_req, res) => res.json({ status: "ok" }));

// /tasks routes
app.use("/tasks", taskRoutes);

// Global error handler (basic)
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
);

app.listen(PORT, () =>
  console.log(`🚀 Server ready on http://localhost:${PORT}`)
);
