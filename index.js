require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3056;
app.listen(PORT, () => {
  console.log(`WSV ChatAppp start with port ${PORT}`);
});
