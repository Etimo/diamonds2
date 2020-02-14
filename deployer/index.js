const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { exec } = require("child_process");

// The branches to redeploy
const branches = (process.env["DEPLOY_BRANCHES"] || "").split(",");
console.log(`Starting deploy webhook for branches: ${branches}`);

// The endpoint to use
const endpoint = process.env["ENDPOINT"];
if (!endpoint) {
  console.error("Unable to start without an endpoint.");
  process.exit(1);
}

app.use(bodyParser.json());

function redeploy(hash) {
  exec(`./redeploy.sh ${hash}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
      return;
    }
    if (stderr) {
      console.error(stderr);
      return;
    }
    console.log(stdout);
  });
}

app.post("/" + endpoint, (req, res) => {
  try {
    const body = req.body;
    const action = body["action"];
    if (action === "completed") {
      const checkRun = body["check_run"];
      if (
        checkRun &&
        checkRun["conclusion"] === "success" &&
        checkRun["name"] === "Travis CI - Branch"
      ) {
        // Successful build, check branch
        const checkSuite = checkRun["check_suite"];
        if (checkSuite) {
          const branch = checkSuite["head_branch"];
          if (branches.indexOf(branch) > -1) {
            const sha = checkSuite["head_sha"];
            console.log(`Found successful build for commit hash ${sha}`);
            redeploy(sha);
          } else {
            console.log(`Received new event but was invalid branch: ${branch}`);
          }
        }
      }
    }
  } catch (e) {
    // res.send(e);
  }
  res.send("OK");
});

app.listen(port, () =>
  console.log(`Deploy webhook listening on port ${port}!`)
);
