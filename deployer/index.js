const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const crypto = require("crypto");

const sigHeaderName = "X-Hub-Signature";
const secret = process.env["GITHUB_SECRET"];

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
    const payload = JSON.stringify(req.body);
    if (!payload) {
      res.status(404).send("");
      return;
    }

    // Verify signature
    const sig = req.get(sigHeaderName) || "";
    const hmac = crypto.createHmac("sha1", secret);
    const digest = Buffer.from(
      "sha1=" + hmac.update(payload).digest("hex"),
      "utf8"
    );
    const checksum = Buffer.from(sig, "utf8");
    if (
      checksum.length !== digest.length ||
      !crypto.timingSafeEqual(digest, checksum)
    ) {
      console.log("Invalid signature");
      res
        .status(403)
        .send(
          `Request body digest (${digest}) did not match ${sigHeaderName} (${checksum})`
        );
      return;
    }

    // Process data
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
    console.error(e);
    // res.send(e);
  }
  res.send("OK");
});

app.listen(port, () =>
  console.log(`Deploy webhook listening on port ${port}!`)
);
