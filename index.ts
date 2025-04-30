import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes";

const App = express();
App.use(cors());
App.use(express.json());

App.listen(3000, () => {
  console.log("Listening to 3000");
});
// App.use("/", (req, res) => {
//   res.send("hello");
// });

App.use("/user", userRoutes);
