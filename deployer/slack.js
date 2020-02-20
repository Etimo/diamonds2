const http = require("https");

if (process.argv.length < 7) {
  console.log("Missing parameters.");
  console.log("Usage:");
  console.log(
    "    node slack.js <slack-url> <successful> <branch> <commit> <host>"
  );
  process.exit(1);
}

const url = process.argv[2];
const successful = process.argv[3] === "1";
const branch = process.argv[4];
const commit = process.argv[5];
const host = process.argv[6];

const request = http.request(url, {
  method: "POST"
});

const message = successful
  ? `Diamonds2 ${branch} deployed successfully`
  : `Diamonds2 ${branch} failed to deploy`;
request.write(
  JSON.stringify({
    fallback: message,
    text: message,
    color: successful ? "good" : "danger",
    fields: [
      {
        title: "Branch and commit",
        value: `${branch}, ${commit}`,
        short: true
      },
      {
        title: "Host",
        value: host,
        short: true
      }
    ]
  })
);

request.end();
