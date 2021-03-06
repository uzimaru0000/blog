// @ts-ignore
global.XMLHttpRequest = require('xhr2');

import fs from 'fs';
import prompts from 'prompts';
import { search, Emoji, emojify } from 'node-emoji';

import { Elm } from './Elm/Main.elm';
import { uploadImage } from './api';
import { existDir, mkdir, readFile, openEditor, remove } from './util';

const clientId = 'f1d7dba802aa5fd';

(async () => {
  try {
    const isExist = await existDir(`${process.env.HOME}/.blog/token`);
    const json = JSON.parse(
      isExist
        ? fs.readFileSync(`${process.env.HOME}/.blog/token`).toString()
        : '{ "token": null }'
    );

    const { token } = json;

    const app = Elm.Main.init({
      flags: {
        argv: process.argv.slice(2).join(' '),
        token,
      },
    });

    app.ports.output.subscribe(async (opts) => {
      try {
        const { value } = await prompts(opts);
        if (value === undefined) {
          process.exit(0);
        }
        app.ports.input.send(value);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });

    app.ports.exit.subscribe(([code, msg]) => {
      console.log(msg);
      process.exit(code);
    });

    app.ports.save.subscribe(async (token) => {
      await existDir(`${process.env.HOME}/.blog`).then(
        (x) => !x && mkdir(`${process.env.HOME}/.blog`)
      );

      fs.writeFileSync(
        `${process.env.HOME}/.blog/token`,
        JSON.stringify({ token })
      );

      console.log('Login success');
    });

    app.ports.read.subscribe(async (path) => {
      const data = await readFile(path)
        .then((x) => emojify(x.toString()))
        .then(emojiProcess)
        .then(localImageProcess);
      app.ports.readFile.send(data);
    });

    app.ports.uploadImage.subscribe(async (path) => {
      const result = await readFile(path).then((x) => uploadImage(clientId, x));
      app.ports.uploadResult.send(result.data.link);
    });

    app.ports.openFile.subscribe(async (content) => {
      const tmpPath = `${process.env.HOME}/.blog/tmp.md`;

      fs.writeFileSync(tmpPath, content);

      try {
        await openEditor(tmpPath);
        const result = await readFile(tmpPath)
          .then((x) => emojify(x.toString()))
          .then(emojiProcess)
          .then(localImageProcess);
        remove(tmpPath);

        app.ports.readFile.send(result);
      } catch (e) {
        console.log(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
})();

// ??????????????????
const localImageProcess = async (md: string) => {
  const localURL = findLocalImage(md);

  const replaceFuncs = await Promise.all(
    localURL.map((x) =>
      readFile(x)
        .then((buff) => uploadImage('f1d7dba802aa5fd', buff))
        .then(({ data }) => [x, data.link] as [string, string])
        .then(([path, url]) => replaceLocalImage(path, url))
    )
  );

  return replaceFuncs.reduce((acc, x) => x(acc), md);
};

const findLocalImage = (md: string) => {
  const imageRegex = /!\[(?:.*)\]\((.+)\)/;
  const urlRegex = /http(?:s|):\/\//;

  if (!imageRegex.test(md)) {
    return [];
  }

  return md
    .match(new RegExp(imageRegex, 'g'))
    .map((x) => x.match(imageRegex)[1])
    .filter((x) => !urlRegex.test(x));
};

const replaceLocalImage = (localPath: string, url: string) => (md: string) =>
  md.replace(localPath, url);

// ?????????????????????
const emojiProcess = (md: string) =>
  findEmoji(md)
    .map((x) => (console.log(x), x))
    .map((x) => [x, search(x)] as [string, Emoji[]])
    .filter(([_, x]) => x.length > 0)
    .map(([str, [emoji]]) => [str, emoji] as [string, Emoji])
    .map(([str, emoji]) => (md: string) => md.replace(str, emoji.emoji))
    .reduce((acc, x) => x(acc), md);

const findEmoji = (md: string) => {
  const emojiRegex = /:(\w*):/;

  if (!emojiRegex.test(md)) {
    return [];
  }

  return md
    .match(new RegExp(emojiRegex, 'g'))
    .map((x) => x.match(emojiRegex)[0]);
};
