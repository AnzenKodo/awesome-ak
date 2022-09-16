import Engine from "https://esm.sh/@ahmadnassri/template-literals-engine@2.0.0";

const engine = new Engine();

const json = await fetch(
  "https://raw.githubusercontent.com/AnzenKodo/nixed/master/web/Bookmarks.bak",
).then((res) => res.json());

const obj = json.roots.bookmark_bar.children;
const bookmarks = obj.filter((val) => val.id === "333");
const child = bookmarks[0].children;

let md = "";
function loopNested(objs, count = 2) {
  const preCount = count;

  for (const obj of objs) {
    if (obj.type === "folder") {
      md += `\n${"#".repeat(preCount)} ${obj.name}\n`;

      loopNested(obj.children, ++count);
    } else {
      const title = obj.name.match(/^.*(?=\s-\s)/);
      const des = obj.name.replace(/^.*\s-\s/, "");

      if (title) {
        md += `- [${title[0]}](${obj.url}) - ${des}\n`;
      } else {
        md += `- [${obj.name}](${obj.url})\n`;
      }
    }
    count = preCount;
  }

  return md;
}

const description = await fetch(
  "https://api.github.com/repos/AnzenKodo/ak-awesome",
).then((res) => res.json()).then((res) => res.description);

const raw = `# ${bookmarks[0].name}

[![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)

${description}

<div align="center">
<a href=""><img alt="Download Bookmarks" src="https://img.shields.io/badge/download-bookmarks-0583f2?style=for-the-badge&labelColor=170327" width="30%"></a>
</div>

${loopNested(child)}`;

Deno.writeTextFileSync("./README.md", raw);
