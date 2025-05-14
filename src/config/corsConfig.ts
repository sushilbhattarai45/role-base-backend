import cors from "cors";
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
