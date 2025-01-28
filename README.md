
# Kuaishou Downloader

**Kuaishou Downloader** adalah alat sederhana berbasis Node.js dan Bash untuk scraping dan mengunduh video dari Kuaishou. 

## Fitur
- Otomatis scraping dan decoding video URL dari halaman Kuaishou.
- Mengunduh video ke folder `downloads` dengan satu perintah.
- Mudah digunakan hanya dengan memasukkan URL.

## Cara Pakai

### 1. Instalasi
1. Clone repository ini atau download zip-nya.
2. Pastikan Node.js dan npm sudah terinstal di sistem kamu.
3. Install semua module yang diperlukan:
   ```bash
   npm install
   ```

### 2. Jalankan Program
Gunakan perintah berikut untuk menjalankan downloader:
```bash
./run.sh <URL-Kuaishou>
```

Contoh:
```bash
./run.sh https://v.kuaishou.com/fMthnX
```

### 3. Hasil Download
Video yang berhasil diunduh akan disimpan secara otomatis di folder `downloads`.

## Struktur Proyek
```
kuaishou-downloader/
│
├── downloads/           # Folder untuk menyimpan hasil video
├── index.js             # Script utama (Node.js)
├── run.sh               # Script Bash untuk menjalankan scraping
├── package.json         # File konfigurasi Node.js
└── README.md            # Dokumentasi proyek
```

## Lisensi
Proyek ini menggunakan lisensi [MIT](https://opensource.org/licenses/MIT).

## Kontributor
Dibuat oleh **Rizxyu**.
