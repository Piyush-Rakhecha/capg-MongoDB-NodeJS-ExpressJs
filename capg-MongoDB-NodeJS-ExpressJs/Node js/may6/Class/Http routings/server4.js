const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("content-type", "text/html");
  res.statusCode = 200;
  res.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign Up</title>
</head>
<body>
  <h1 style="color: #3a3af5;">Sign Up for Updates</h1>
  <form>
    <label>Email:</label>
    <input type="text" /><br><br>
    <label>Password:</label>
    <input type="password" /><br><br>
    <button>Submit</button>
    <hr>
  </form>
</body>
</html>
  `);
  res.end();
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log("Server running at http://localhost:3000");
});
