# Face Recognition Attendance System

## Deskripsi
Sistem face recognition untuk pencatatan kehadiran karyawan dengan flow yang sederhana dan efisien:
**webcam --> register wajah ke DB --> InsightFace --> inferensi --> Logging**

Sistem ini menggunakan InsightFace yang memiliki pipeline lengkap (retina+embedding), sehingga tidak memerlukan framework YOLO terpisah. Registrasi berbasis embedding menghasilkan output yang konsisten dan lebih robust untuk real-world applications.

## Fitur Utama
1. **Registrasi Karyawan** - Mendaftarkan karyawan baru dengan menyimpan embedding wajah ke database
2. **Face Recognition Real-time** - Mengenali karyawan secara real-time menggunakan webcam
3. **Logging Kehadiran** - Mencatat kehadiran karyawan ke database SQLite
4. **Penyimpanan Gambar** - Menyimpan gambar wajah karyawan di folder lokal untuk referensi

## Struktur Sistem
```
testingFR/
├── data/
│   ├── employees/              # Gambar karyawan (referensi)
│   └── registered_faces/       # Gambar wajah karyawan yang terdaftar
├── main.py                     # File utama dengan semua fungsi
├── requirements.txt            # Dependensi yang diperlukan
├── environment.yml             # Konfigurasi environment Conda
├── README.md                   # Dokumentasi utama
├── HOW_TO_RUN.md               # Panduan menjalankan sistem
├── HOW_TO_TEST.md              # Panduan testing
├── check_env.py                # Script verifikasi environment
├── test.py                     # Testing script
├── run.py                      # Runner face recognition
├── register.py                 # Registrasi karyawan
├── FILE_CLEANUP_LOG.md         # Log file yang dihapus
├── attendance.db               # Database SQLite
```

## Dependensi
- numpy: Untuk operasi array dan perhitungan vektor
- opencv-python: Untuk akses webcam dan tampilan video
- insightface: Untuk deteksi dan pengenalan wajah
- sqlalchemy: Untuk interaksi dengan database SQLite

### Dependensi Opsional untuk Akselerasi GPU
- CUDA Toolkit (untuk NVIDIA GPU)
- GPU driver yang kompatibel

## Instalasi
1. Pastikan Python 3.7+ terinstal
2. Instal dependensi:
   ```bash
   pip install -r requirements.txt
   ```

Atau menggunakan Conda:
```bash
conda env create -f environment.yml
conda activate fr-system
```

## Penggunaan
```bash
python main.py
```

### 1. Manage Employee
- Pilih opsi 1 di menu utama untuk masuk ke menu manajemen karyawan
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
- Untuk registrasi menggunakan RTSP CCTV:
  - Sistem akan menggunakan URL RTSP default: `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102`
  - Arahkan wajah ke kamera CCTV
  - Tekan 'c' untuk capture wajah
- Gambar wajah akan disimpan di `data/registered_faces/`

### 2. Face Recognition (Webcam)
- Pilih opsi 2 di menu utama
- Sistem akan membuka window webcam
- Wajah yang dikenali akan ditampilkan dengan nama dan similarity score
- Kehadiran akan dicatat ke database `attendance.db`
- Tekan 'q' untuk keluar

### 3. Face Recognition (RTSP CCTV)
- Pilih opsi 3 di menu utama
- Sistem akan menggunakan URL RTSP default: `rtsp://admin:examplepass123!@192.168.1.100:554/Streaming/Channels/102`
- Sistem akan membuka window stream CCTV
- Wajah yang dikenali akan ditampilkan dengan nama dan similarity score
- Kehadiran akan dicatat ke database `attendance.db`
- Tekan tombol 'q' untuk keluar

### 4. Lihat Spesifikasi Sistem
- Pilih opsi 4 di menu utama untuk melihat spesifikasi sistem face recognition

### 5. Parameter Tuning
- Pilih opsi 5 di menu utama untuk menyesuaikan parameter sistem
- Bisa menyesuaikan threshold, ukuran deteksi, smoothing, dan parameter lainnya

## Database
Sistem menggunakan SQLite (`attendance.db`) yang akan dibuat secara otomatis saat pertama kali dijalankan. Database ini berisi dua tabel:

1. `employees`: Menyimpan nama karyawan dan embedding wajah
2. `attendance`: Menyimpan log kehadiran karyawan

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

### Fitur
- Real-time face detection dan recognition
- Multi-person detection dalam satu frame
- Logging kehadiran ke database SQLite
- Smoothing pada bounding box untuk visual yang lebih stabil
- Penyimpanan gambar wajah karyawan

## Troubleshooting
- **Wajah tidak terdeteksi**: Pastikan pencahayaan cukup dan kamera dalam posisi optimal
- **Wajah tidak dikenali**: Pastikan karyawan sudah diregistrasi dan kondisi pencahayaan saat registrasi dan pengenalan sama
- **Database tidak terupdate**: Periksa apakah file `attendance.db` dapat ditulis
- **Kinerja sistem lambat**: Sistem secara otomatis menggunakan GPU jika tersedia. Pastikan driver GPU dan CUDA toolkit sudah terinstal dengan benar untuk akselerasi perangkat keras.

## Catatan Penting
- Sistem ini tidak menggunakan API WhatsApp atau notifikasi eksternal
- Semua logging kehadiran disimpan dalam database lokal
- Threshold pengenalan diset pada 0.5 untuk keseimbangan antara akurasi dan sensitivitas