# Aplikasi Guru Cerdas

Website statis untuk membuat prompt soal pembelajaran.

## Fitur
- Prompt pilihan ganda
- Prompt soal uraian
- Soal campuran
- Kunci jawaban
- Pembahasan soal
- Salin hasil
- Cetak / simpan sebagai PDF melalui dialog print browser
- Responsif untuk desktop dan HP
- Tidak membutuhkan API key

## Cara menjalankan
Buka `index.html` di browser.

## Publikasi gratis
Gunakan GitHub Pages. Upload `index.html`, `styles.css`, dan `app.js` ke repository GitHub publik.
Lalu Settings > Pages > Deploy from a branch > main > / (root).

## Keamanan
Versi ini sengaja tidak memanggil API AI. Tombol "Buat Prompt" hanya menghasilkan teks prompt di browser.

Jika nanti ingin menambahkan API AI:
JANGAN menaruh API key di `app.js` atau HTML karena kode frontend dapat dilihat publik.
Gunakan backend/serverless function sebagai perantara dan simpan secret di environment variables.
