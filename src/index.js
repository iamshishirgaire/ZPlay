import connectDb from "./db/index.js";
import { app } from "./app.js";

connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
});
