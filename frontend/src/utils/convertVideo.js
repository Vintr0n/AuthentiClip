let ffmpegInstance = null;
let fetchFileFn = null;

export async function convertMovToMp4(file) {
  try {
    if (!ffmpegInstance) {
      const ffmpegModule = await import('@ffmpeg/ffmpeg');
      const { createFFmpeg, fetchFile } = ffmpegModule;

      if (typeof createFFmpeg !== 'function') {
        throw new Error('createFFmpeg is not a function');
      }

      ffmpegInstance = createFFmpeg({ log: true }); // Turn on logs temporarily
      fetchFileFn = fetchFile;
      await ffmpegInstance.load();
    }

    const originalName = file.name.replace(/\s+/g, '_');
    const inputName = originalName;
    const outputName = originalName.replace(/\.mov$/i, '.mp4');

    const fileData = await fetchFileFn(file);
    ffmpegInstance.FS('writeFile', inputName, fileData);

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

    return new File([convertedBlob], outputName, { type: 'video/mp4' });
  } catch (err) {
    console.error("FFmpeg error trace:", err);
    throw new Error(err.message || 'Unknown ffmpeg conversion error');
  }
}
