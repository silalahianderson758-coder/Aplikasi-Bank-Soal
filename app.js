const $ = (id) => document.getElementById(id);

let selectedType = "Pilihan Ganda";

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    selectedType = chip.dataset.value;
  });
});

function val(id, fallback = "") {
  const value = $(id).value.trim();
  return value || fallback;
}

function buildPrompt() {
  const teacher = val("teacher", "Nama guru belum dicantumkan");
  const school = val("school", "Nama sekolah belum dicantumkan");
  const subject = val("subject", "Mata pelajaran belum dicantumkan");
  const grade = val("grade", "Kelas/fase belum dicantumkan");
  const topic = val("topic", "Materi/topik belum dicantumkan");
  const count = Math.min(100, Math.max(1, Number($("count").value) || 10));
  const difficulty = $("difficulty").value;
  const cognitive = $("cognitive").value;
  const extra = val("extra", "Tidak ada instruksi tambahan.");
  const withKey = $("withKey").checked;
  const withExplanation = $("withExplanation").checked;
  const randomize = $("randomize").checked;
  const indonesian = $("indonesian").checked;

  let typeInstruction = "";
  if (selectedType === "Pilihan Ganda") {
    typeInstruction = `
Buat ${count} soal pilihan ganda.
- Setiap soal memiliki 4 pilihan jawaban: A, B, C, dan D.
- Hanya satu pilihan yang paling benar.
- Hindari opsi yang ambigu, terlalu mudah ditebak, atau memiliki dua jawaban benar.
`;
  } else if (selectedType === "Soal Uraian") {
    typeInstruction = `
Buat ${count} soal uraian.
- Soal harus mengukur pemahaman dan kemampuan menerapkan konsep.
- Setelah soal, sediakan pedoman penskoran/rubrik singkat.
`;
  } else {
    typeInstruction = `
Buat ${count} soal dengan komposisi campuran antara pilihan ganda dan uraian.
- Untuk pilihan ganda gunakan 4 opsi A-D dan hanya satu jawaban benar.
- Untuk uraian sertakan pedoman penskoran singkat.
`;
  }

  return `Anda adalah asisten penyusun soal profesional untuk guru.

IDENTITAS PEMBELAJARAN
Nama Guru: ${teacher}
Sekolah: ${school}
Mata Pelajaran: ${subject}
Kelas/Fase: ${grade}
Materi/Topik: ${topic}

SPESIFIKASI
Jenis Soal: ${selectedType}
Jumlah Soal: ${count}
Tingkat Kesulitan: ${difficulty}
Target Kognitif: ${cognitive}
Bahasa: ${indonesian ? "Bahasa Indonesia baku, jelas, dan sesuai usia peserta didik." : "Gunakan bahasa yang sesuai konteks pembelajaran."}
Pengacakan variasi: ${randomize ? "Ya, variasikan konteks dan bentuk soal agar tidak monoton." : "Tidak perlu instruksi pengacakan khusus."}

TUGAS
${typeInstruction}
- Pastikan semua soal benar secara konsep dan sesuai materi ${topic}.
- Gunakan konteks yang relevan dengan kehidupan atau pembelajaran peserta didik.
- Jangan membuat soal di luar materi kecuali diperlukan untuk konteks.
- Nomori soal dengan jelas.

KUNCI JAWABAN
${withKey ? "- Sertakan bagian KUNCI JAWABAN setelah seluruh soal." : "- Jangan sertakan kunci jawaban."}

PEMBAHASAN
${withExplanation ? "- Sertakan PEMBAHASAN setiap soal secara singkat, logis, dan mudah dipahami setelah kunci jawaban." : "- Jangan sertakan pembahasan."}

INSTRUKSI TAMBAHAN
${extra}

FORMAT OUTPUT
1. Judul soal.
2. Identitas: nama sekolah, guru, mata pelajaran, kelas/fase, dan materi.
3. Petunjuk pengerjaan.
4. Seluruh soal.
5. ${withKey ? "Kunci jawaban." : "Tanpa kunci jawaban."}
6. ${withExplanation ? "Pembahasan setiap soal." : "Tanpa pembahasan."}

Periksa kembali ketepatan jawaban sebelum memberikan hasil akhir.`;
}

function generate() {
  const prompt = buildPrompt();
  $("result").value = prompt;
  $("printContent").textContent = prompt;
  $("printMeta").textContent =
    `${val("school","")} • ${val("subject","")} • ${val("grade","")} • ${val("topic","")}`;
  $("status").textContent = "Berhasil dibuat";
  $("status").style.background = "#ecfdf3";
  $("status").style.color = "#15803d";
  $("resultCard").scrollIntoView({behavior:"smooth", block:"start"});
}

$("generateBtn").addEventListener("click", generate);

$("copyBtn").addEventListener("click", async () => {
  const text = $("result").value;
  if (!text) {
    alert("Buat prompt terlebih dahulu.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    $("copyBtn").textContent = "✓ Berhasil Disalin";
    setTimeout(() => $("copyBtn").textContent = "⧉ Salin Hasil", 1600);
  } catch {
    $("result").select();
    document.execCommand("copy");
    alert("Prompt disalin.");
  }
});

$("printBtn").addEventListener("click", () => {
  if (!$("result").value) {
    alert("Buat prompt terlebih dahulu.");
    return;
  }
  window.print();
});

$("clearBtn").addEventListener("click", () => {
  $("result").value = "";
  $("printContent").textContent = "";
  $("printMeta").textContent = "";
  $("status").textContent = "Belum dibuat";
  $("status").style.background = "#f2f4f7";
  $("status").style.color = "#667085";
});

$("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(el => {
    if (el.type === "checkbox") el.checked = (el.id === "withKey" || el.id === "withExplanation" || el.id === "indonesian");
    else if (el.id !== "count") el.value = "";
  });
  $("count").value = 10;
  $("difficulty").value = "Sedang";
  $("cognitive").selectedIndex = 0;
  $("extra").value = "";
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  document.querySelector('.chip[data-value="Pilihan Ganda"]').classList.add("active");
  selectedType = "Pilihan Ganda";
  $("clearBtn").click();
});
