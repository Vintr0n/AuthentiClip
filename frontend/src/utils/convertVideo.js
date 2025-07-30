// src/utils/convertVideo.js
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


const ffmpeg = createFFmpeg({ log: false });

export async function convertMovToMp4(file) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const originalName = file.name.replace(/\s+/g, '_');
  const inputName = originalName;
  const outputName = originalName.replace(/\.mov$/i, '.mp4');

  ffmpeg.FS('writeFile', inputName, await fetchFile(file));

  await ffmpeg.run(
    '-i', inputName,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    outputName
  );

  const data = ffmpeg.FS('readFile', outputName);
  const convertedBlob = new Blob([data.buffer], { type: 'video/mp4' });

  return new File([convertedBlob], outputName, {
    type: 'video/mp4',
  });
}
