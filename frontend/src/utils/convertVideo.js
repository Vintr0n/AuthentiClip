let ffmpegInstance = null;

export async function convertMovToMp4(file) {
  if (!ffmpegInstance) {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');

    ffmpegInstance = createFFmpeg({ log: false });
    await ffmpegInstance.load();
  }

  const originalName = file.name.replace(/\s+/g, '_');
  const inputName = originalName;
  const outputName = originalName.replace(/\.mov$/i, '.mp4');

  ffmpegInstance.FS('writeFile', inputName, await fetchFile(file));

  await ffmpegInstance.run(
    '-i', inputName,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '23',
    '-c:a', 'aac',
    outputName
  );

  const data = ffmpegInstance.FS('readFile', outputName);
  const convertedBlob = new Blob([data.buffer], { type: 'video/mp4' });

  return new File([convertedBlob], outputName, {
    type: 'video/mp4',
  });
}
