let ffmpegInstance = null;

export async function convertMovToMp4(file) {
  if (!ffmpegInstance) {
    // Use await import as a function, not destructuring
    const ffmpegModule = await import('@ffmpeg/ffmpeg');

    if (!ffmpegModule || typeof ffmpegModule.createFFmpeg !== 'function') {
      throw new Error('createFFmpeg is not available from @ffmpeg/ffmpeg');
    }

    const createFFmpeg = ffmpegModule.createFFmpeg;
    const fetchFile = ffmpegModule.fetchFile;

    ffmpegInstance = createFFmpeg({ log: false });
    await ffmpegInstance.load();

    ffmpegInstance.fetchFile = fetchFile; // needed in some bundlers
  }

  const originalName = file.name.replace(/\s+/g, '_');
  const inputName = originalName;
  const outputName = originalName.replace(/\.mov$/i, '.mp4');

  ffmpegInstance.FS('writeFile', inputName, await ffmpegInstance.fetchFile(file));

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
