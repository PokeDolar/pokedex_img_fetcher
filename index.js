const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PokedexImgSchema = new Schema({
  imageUrl: { type: "String", required: true },
  number: { type: "String", required: true },
  artist: { type: "String", required: true },
  filePath: { type: "String", required: true, unique: true },
});

let PokemonImg = mongoose.model("PokeDex", PokedexImgSchema);

mongoose.connect("mongodb://localhost:27017/pokemontcgimages");

async function downloadImage(url, filename) {
  const path = Path.resolve(__dirname, `arts/`, `${filename}.png`);
  const writer = Fs.createWriteStream(path);
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

(async () => {
  for (let h = 690; h <= 890; h++) {
    let i = `${h}`.padStart(3, 0);
    console.log(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${i}.png`)
    await downloadImage(
      `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${i}.png`,
      `${i}_f1`
    );
    PokemonImg({
      imageUrl: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${i}.png`,
      number: i,
      artist: "Ken Sugimori",
      filePath: `arts/${i}_f1`,
    }).save();
    for (let j = 2; j <= 4; j++) {
      try {
        await downloadImage(
          `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${i}_f${j}.png`,
          `${i}_f${j}`
        );
        PokemonImg({
          imageUrl: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${i}_f${j}.png`,
          number: i,
          artist: "Ken Sugimori",
          filePath: `arts/${i}_f${j}`,
        }).save();
      } catch (e) {
        console.log(`Não há forma ${j} para ${i}`);
      }
    }
  }
})();
