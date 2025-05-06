import express from "express";
export const AdminMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    console.log(req.user);
    if (req.user.role != "admin") {
      res.status(400).send({
        message: "Permission Denied",
        status: "failed",
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal Server Error",
      status: "failed",
    });
  }
};
