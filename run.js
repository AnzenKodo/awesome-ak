const json = await fetch(
  "https://raw.githubusercontent.com/AnzenKodo/dotfiles/master/browser/Bookmarks.bak",
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
TODO: Add install intraction
<div align="center">
<a href=""><img alt="Download Bookmarks" src="https://img.shields.io/badge/download-bookmarks-0583f2?style=for-the-badge&labelColor=170327" width="30%"></a>
</div>

${loopNested(child)}`;

Deno.writeTextFileSync("./README.md", raw);

let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="1646887372" LAST_MODIFIED="1664363974" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks</H3>
    <DL><p>`;

// Backup file

function loopHtml(objs, count = 2) {
  const preCount = count;

  for (const obj of objs) {
    if (obj.type === "folder") {
      html += `\n<DT><H3>${obj.name}</H3>\n<DL><p>\n`;

      loopNested(obj.children, ++count);
    } else {
      const title = obj.name.match(/^.*(?=\s-\s)/);
      const des = obj.name.replace(/^.*\s-\s/, "");

      if (title) {
        html += `<DT><A HREF="${obj.url}">${title[0]} - ${des}</A>\n`;
      } else {
        html += `<DT><A HREF="${obj.url}">${title[0]}</A>\n`;
      }
    }
    count = preCount;
  }

  return html += "</DL><p>";
}

console.log(loopHtml(child));
