let ffmpegInstance = null;

export async function convertMovToMp4(file) {
  try {
    if (!ffmpegInstance) {
      const { createFFmpeg, fetchFile } = (await import('@ffmpeg/ffmpeg')).default;

      ffmpegInstance = createFFmpeg({ log: true });
      await ffmpegInstance.load();

      // Save fetchFile for later
      ffmpegInstance._fetchFile = fetchFile;
    }

    const originalName = file.name.replace(/\s+/g, '_');
    const inputName = originalName;
    const outputName = originalName.replace(/\.mov$/i, '.mp4');

    const fileData = await ffmpegInstance._fetchFile(file);
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
    console.error("FFmpeg conversion error:", err);
    throw new Error(err.message || 'Unknown ffmpeg conversion error');
  }
}
