# HOW_TO_RUN.md
# Panduan Menjalankan Sistem Face Recognition

## Prasyarat
1. Python 3.7 atau lebih tinggi
2. Webcam yang berfungsi
3. Koneksi internet (untuk instalasi dependensi)
4. (Opsional) NVIDIA GPU dengan CUDA untuk akselerasi perangkat keras

## Instalasi

### Metode 1: Menggunakan pip
1. **Instal dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Verifikasi instalasi**:
   ```bash
   python check_env.py
   ```

### Metode 2: Menggunakan Conda
1. **Buat environment baru**:
   ```bash
   conda env create -f environment.yml
   ```

2. **Aktifkan environment**:
   ```bash
   conda activate fr-system
   ```

3. **Verifikasi instalasi**:
   ```bash
   python check_env.py
   ```

## Struktur Data Karyawan

Pastikan struktur folder data karyawan sudah benar:
```
data/
├── employees/
│   ├── Budi.jpg
│   ├── Andi.png
│   ├── Cici.jpeg
│   └── ... (gambar wajah karyawan lainnya)
└── registered_faces/
    ├── Budi.jpg
    ├── Andi.jpg
    └── ... (gambar wajah karyawan yang terdaftar)
```

Setiap file gambar dalam folder `data/employees/` akan dianggap sebagai wajah karyawan dengan nama file sebagai nama karyawan.

## Cara Menjalankan Sistem

### 1. Menu Utama
```
python main.py
```

Ini akan menampilkan menu dengan opsi:
1. Manage employee
2. Jalankan face recognition (Webcam)
3. Jalankan face recognition (RTSP CCTV)
4. Lihat spesifikasi sistem
5. Parameter tuning
6. Keluar

### 2. Manage Employee
Pilih opsi 1 di menu utama untuk masuk ke menu manajemen karyawan:
- Opsi 1: Tambah karyawan (registrasi wajah baru menggunakan webcam)
- Opsi 2: Tambah karyawan (registrasi wajah baru menggunakan RTSP CCTV)
- Opsi 3: Hapus karyawan
- Opsi 4: Lihat spesifikasi sistem
- Opsi 5: Parameter tuning
- Opsi 6: Kembali ke menu utama

Untuk menambah karyawan:
- Masukkan nama karyawan baru
- Untuk registrasi menggunakan webcam:
  - Arahkan wajah ke webcam
  - Tekan 'c' untuk capture wajah
  - Tekan 'q' untuk keluar dari mode registrasi
- Untuk registrasi menggunakan RTSP CCTV:
  - Sistem akan menggunakan URL RTSP default: `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102`
  - Arahkan wajah ke kamera CCTV
  - Tekan 'c' untuk capture wajah
  - Tekan 'q' untuk keluar dari mode registrasi

### 3. Face Recognition (Webcam)
Pilih opsi 2 di menu utama untuk menjalankan face recognition secara real-time menggunakan webcam.

### 4. Face Recognition (RTSP CCTV)
Pilih opsi 3 di menu utama untuk menjalankan face recognition secara real-time menggunakan stream RTSP dari CCTV:
- Sistem akan menggunakan URL RTSP default: `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102`
- Tekan 'q' untuk keluar dari mode face recognition

Atau jalankan langsung:
```
python run.py
```

### 5. Lihat Spesifikasi Sistem
Pilih opsi 4 di menu utama atau opsi 4 di menu manajemen karyawan untuk melihat spesifikasi sistem face recognition.

### 6. Parameter Tuning
Pilih opsi 5 di menu utama atau opsi 5 di menu manajemen karyawan untuk menyesuaikan parameter sistem:
- Threshold deteksi dan pengenalan
- Ukuran deteksi
- Faktor smoothing bounding box
- Cooldown pengenalan

## Cara Kerja Sistem

1. **Deteksi Wajah**:
   - Menggunakan InsightFace untuk mendeteksi wajah dalam frame webcam
   - Memberikan bounding box untuk setiap wajah yang terdeteksi

2. **Ekstraksi Embedding**:
   - Menggunakan InsightFace untuk mengekstrak embedding wajah
   - Menyimpan embedding ke database SQLite

3. **Pengenalan Wajah**:
   - Membandingkan embedding wajah yang terdeteksi dengan database karyawan
   - Menggunakan cosine similarity untuk perbandingan

4. **Logging Kehadiran**:
   - Mencatat kehadiran ke file database SQLite: `attendance.db`
   - Menggunakan cooldown 10 detik untuk mencegah pencatatan berulang

## Optimasi Kinerja

Sistem ini secara otomatis menggunakan akselerasi GPU jika tersedia untuk meningkatkan kinerja:
- Menggunakan `CUDAExecutionProvider` jika tersedia, fallback ke `CPUExecutionProvider` jika tidak
- Mengurangi ukuran deteksi menjadi 320x320 piksel untuk kinerja yang lebih baik
- Tidak lagi menggunakan frame skipping untuk memastikan stabilitas bounding box
- Mengimplementasikan smoothing pada bounding box untuk tampilan yang lebih stabil
- Menampilkan FPS secara real-time untuk monitoring kinerja
- Mendukung multi-person detection dalam satu frame

## Spesifikasi Sistem Face Recognition

### Model dan Algoritma
- **Model**: InsightFace (Buffalo_L)
- **Detection Threshold**: 0.5 (untuk keseimbangan antara akurasi dan sensitivitas)
- **Detection Size**: 320x320 piksel untuk optimal performance
- **Recognition Cooldown**: 10 detik untuk mencegah pencatatan kehadiran berulang
- **BBox Smoothing Factor**: 0.85 untuk stabilitas bounding box yang lebih baik
- **Max Distance Threshold**: 150 pixels untuk matching wajah yang lebih konsisten
- **Tracking Timeout**: 3.0 detik untuk mempertahankan ID tracking lebih lama

### Performa
- **Target FPS**: 30 FPS
- **Frame Skip**: Tidak digunakan (untuk stabilitas bounding box)
- **Multi-Person Detection**: Didukung
- **Providers**: CUDAExecutionProvider (jika tersedia), CPUExecutionProvider

## Hasil yang Diharapkan

1. **Tampilan Real-time**:
   - Frame webcam dengan bounding box di sekitar wajah
   - Nama karyawan di atas bounding box jika wajah dikenali
   - Warna bounding box hijau untuk wajah dikenali, merah untuk wajah tidak dikenali

2. **Logging**:
   - Database SQLite `attendance.db` akan memiliki tabel `attendance` dengan data kehadiran

## Troubleshooting

### Webcam Tidak Terdeteksi
- Pastikan kamera tidak digunakan aplikasi lain
- Periksa apakah kamera berfungsi dengan aplikasi bawaan sistem
- Coba ganti indeks kamera di kode (0 menjadi 1, dst.)

### Wajah Tidak Dikenali
- Pastikan gambar dalam folder `data/employees/` memiliki kualitas baik
- Pastikan pencahayaan cukup saat testing
- Pastikan wajah dalam frame webcam terlihat jelas

### Error Dependensi
- Pastikan semua dependensi telah terinstal dengan benar
- Periksa versi Python yang digunakan (harus 3.7+)
- Coba instal ulang dependensi jika ada yang gagal

## Penggunaan RTSP CCTV

Sistem mendukung penggunaan kamera IP CCTV yang terhubung melalui jaringan untuk registrasi karyawan dan pengenalan wajah secara real-time.

### Konfigurasi RTSP Default
- **Username**: admin
- **Password**: examplepass123!
- **IP Address**: 192.168.1.100
- **Port**: 554
- **Stream Path**: /Streaming/Channels/102
- **URL Lengkap**: `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102`

### Format URL RTSP Umum
Format umum URL RTSP untuk kamera IP:
```
rtsp://[username]:[password]@[ip_address]:[port]/[path_stream]
```

Contoh:
- `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102` (dengan autentikasi)
- `rtsp://192.168.1.100:554/Streaming/Channels/102` (tanpa autentikasi)

## Parameter Tuning

Sistem menyediakan fitur parameter tuning untuk menyesuaikan kinerja dan akurasi sesuai kebutuhan:

### Melalui Menu Interaktif
```bash
python main.py
# Pilih opsi "Parameter tuning" dari menu
```

### Melalui Script Langsung
```bash
python parameter_tuning.py
```

### Secara Manual
Edit file `parameter.md` untuk informasi lokasi parameter dalam kode.

## Pengembangan Selanjutnya

Setelah sistem dasar berjalan dengan baik, sistem dapat dikembangkan untuk:
1. Menambahkan antarmuka grafis
2. Menambahkan fitur ekspor data kehadiran
3. Menambahkan statistik kehadiran
4. Menambahkan fitur manajemen karyawan

Lihat `README_RTSP.md` untuk dokumentasi lengkap tentang penggunaan RTSP CCTV dalam sistem.