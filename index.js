const PORT = 5001;
const express = require("express");

const app = express();
app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
