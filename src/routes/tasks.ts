import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

// GET /tasks  ────────────────────────────────────────────────────────────
router.get("/", async (_req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /tasks  ───────────────────────────────────────────────────────────
router.post("/", async (req, res, next) => {
  try {
    const { title, color = "blue" } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const task = await prisma.task.create({
      data: { title, color },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id  ────────────────────────────────────────────────────────
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, color, completed } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { title, color, completed },
    });
    res.json(task);
  } catch (err) {
    // Record not found → 404
    if ((err as any).code === "P2025") return res.sendStatus(404);
    next(err);
  }
});

// DELETE /tasks/:id  ─────────────────────────────────────────────────────
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.task.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    if ((err as any).code === "P2025") return res.sendStatus(404);
    next(err);
  }
});

export default router;
