const DIGEST_SIZE_BYTES = 32;

$('upload').addEventListener('change', (evt) => {
  handleFile(evt.target.files[0]);
}, false);

async function handleFile(file) {
  $('download').style.display = 'none';

  if (file.size < 1 * 1024) {
    alert('文件大小不足 1KB，看起来不像是个 frp.bin');
    return;
  }

  if (file.size > 1 * 1024 * 1024) {
    alert('文件大小超过 1MB，看起来不像是个 frp.bin');
    return;
  }

  const data = await readFile(file);
  console.log(`read data, length: ${data.length / 1024}KB`);

  const originalHash = data.slice(0, DIGEST_SIZE_BYTES);
  console.log(`original hash: ${toHex(originalHash)}`);

  const computedHash = await calculateHash(data);
  console.log(`computed hash: ${toHex(computedHash)}`);

  if (originalHash.toString() != computedHash.toString()) {
    alert('这看起来不是一个正常的 frp.bin');
    return;
  }

  data[data.length - 1] = 0x01;

  const finalHash = await calculateHash(data);
  console.log(`final hash: ${toHex(finalHash)}`);

  data.set(finalHash, 0);

  const blob = new Blob([ data.buffer ]);
  const url = window.URL.createObjectURL(blob);

  const link = $('url');
  link.download = 'frp-unlocked.bin';
  link.href = url;

  $('download').style.display = 'block';
}
