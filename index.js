const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

/**
 * Fungsi mendownload file dari URL
 * @param {string} fileUrl
 * @param {string} outputLocationPath
 */
async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
  const response = await axios({
    url: fileUrl,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

/**
 * Fungsi scraping video dari URL
 * @param {string} url
 * @returns {Promise<string>} URL video
 */
async function scrapeVideoUrl(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    const scriptTag = $("script")
      .filter((_, el) => $(el).html().includes("window.INIT_STATE"))
      .html();

    if (!scriptTag) throw new Error("INIT_STATE tidak ditemukan.");

    const jsonString = scriptTag.match(/window\.INIT_STATE\s*=\s*(\{.*\});?/)[1];
    const result = JSON.parse(jsonString);

    const decodedResult = Object.keys(result).reduce((acc, key) => {
      const decodedKey = key
        .replace(/\\u[0-9a-fA-F]{4}/g, (match) =>
          String.fromCharCode(parseInt(match.replace("\\u", ""), 16))
        )
        .split("")
        .map((char) => {
          if (char >= "a" && char <= "z") {
            return String.fromCharCode(((char.charCodeAt(0) - 97 - 1 + 26) % 26) + 97);
          } else if (char >= "A" && char <= "Z") {
            return String.fromCharCode(((char.charCodeAt(0) - 65 - 1 + 26) % 26) + 65);
          } else {
            return char;
          }
        })
        .join("");
      acc[decodedKey] = result[key];
      return acc;
    }, {});

    const photoKey = Object.keys(decodedResult).find((key) =>
      decodedResult[key]?.photo
    );
    if (!photoKey) throw new Error("Key dengan variabel 'photo' tidak ditemukan.");

    const videoData = decodedResult[photoKey];
    const videoUrl = videoData.photo.manifest.adaptationSet[0].representation[0].url;

    return videoUrl;
  } catch (error) {
    throw new Error(`Gagal scrape: ${error.message}`);
  }
}

/**
 * Main function
 */
(async () => {
  const inputUrl = process.argv[2];
  if (!inputUrl) {
    console.error("Error: Masukkan URL sebagai argumen.");
    process.exit(1);
  }

  try {
    console.log("开始刮擦...");
    const videoUrl = await scrapeVideoUrl(inputUrl);
    console.log("找到了视频URL:", videoUrl);

    const fileName = path.basename(videoUrl.split("?")[0]);
    const outputPath = path.join(__dirname, "downloads", fileName);

    console.log(`将视频下载到 ${outputPath}...`);
    await downloadFile(videoUrl, outputPath);
    console.log("下载完成！");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
})()
