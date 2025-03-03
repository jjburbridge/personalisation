/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const { createClient } = require("@sanity/client");

const client = createClient({
  projectId: "ikcwiihw",
  dataset: "production",
  apiVersion: "2024-11-01",
  useCdn: false,
});

(async () => {
  //gets all strings as an object could be done at build time and stored in a file.

  const data = await client.fetch(`*[_type == "strings"][0]{strings}`);
  const { strings } = data;
  const obj = {};
  strings.map((string) => {
    const newObj = {};
    string.string.map((s) => {
      newObj[s._key] = s.value;
    });
    obj[string.key] = newObj;
  });


  fs.writeFileSync("public/strings.json", JSON.stringify(obj));
})();
