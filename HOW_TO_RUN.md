# Cara Menjalankan Sistem Face Recognition

## Struktur Sistem
Proyek ini memiliki dua versi sistem face recognition:
1. **Versi Command-Line** - Berada di direktori `face_recognition_only/`
2. **Versi Web Application** - Berada di direktori utama

## Versi Command-Line

### Menjalankan Sistem
```bash
cd face_recognition_only
python main.py
```

### Struktur File
- `database.py` - Berisi logika database dan konfigurasi sistem
- `face_recognition_app.py` - Berisi semua fungsi face recognition
- `main.py` - Entry point untuk aplikasi
- `employee_status_tracker.py` - Modul pelacakan status karyawan (opsional)
- `enhanced_tracking_config.py` - Konfigurasi pelacakan yang ditingkatkan (opsional)
- `parameter_tuning.py` - Penyesuaian parameter sistem
- `parameter_config.json` - File konfigurasi parameter

### Menu Utama
Setelah menjalankan perintah di atas, Anda akan melihat menu utama:
1. **Manage employee** - Mengelola data karyawan (tambah/hapus)
2. **Jalankan face recognition (Webcam)** - Mengenali wajah menggunakan webcam
3. **Jalankan face recognition (RTSP CCTV)** - Mengenali wajah menggunakan stream CCTV
4. **Lihat spesifikasi sistem** - Menampilkan konfigurasi sistem
5. **Parameter tuning** - Menyesuaikan parameter sistem
6. **Keluar** - Keluar dari aplikasi

### Registrasi Karyawan
1. Pilih opsi 1 di menu utama
2. Pilih opsi 1 untuk menambah karyawan via webcam atau opsi 2 untuk CCTV
3. Masukkan nama karyawan
4. Arahkan wajah ke kamera
5. Tekan 'c' untuk capture wajah
6. Tekan 'q' untuk selesai

### Face Recognition
1. Pilih opsi 2 (webcam) atau opsi 3 (CCTV) di menu utama
2. Sistem akan membuka window kamera
3. Wajah yang dikenali akan ditampilkan dengan nama
4. Kehadiran akan dicatat ke database
5. Tekan 'q' untuk keluar

## Versi Web Application

### Menjalankan Sistem
```bash
python application.py
```

### Struktur File
- `application.py` - Aplikasi web utama dengan Flask
- `AI_module.py` - Modul AI untuk pemrosesan background (termasuk FaceRecognitionSystem)
- `db_manager.py` - Manajer database (termasuk model database)
- `camera_manager.py` - Manajer kamera (konfigurasi dan operasi)
- `tracking_manager.py` - Manajer pelacakan

### Mengakses Dashboard
1. Jalankan perintah di atas
2. Buka browser dan akses `http://localhost:5000`
3. Dashboard akan menampilkan:
   - Status karyawan
   - Kamera yang aktif
   - Log kehadiran
   - Kontrol sistem

## Konfigurasi Sistem

### Parameter Sistem
Anda dapat menyesuaikan parameter sistem melalui:
1. Menu "Parameter tuning" di versi command-line
2. File `parameter_config.json` secara langsung

### Parameter Utama
- **Detection Threshold**: Threshold untuk deteksi wajah
- **Recognition Threshold**: Threshold untuk pengenalan wajah
- **Detection Size**: Ukuran input untuk deteksi
- **Recognition Cooldown**: Jeda antara pencatatan kehadiran
- **BBox Smoothing Factor**: Faktor smoothing untuk bounding box

## Troubleshooting

### Masalah Umum
1. **Wajah tidak terdeteksi**: Pastikan pencahayaan cukup
2. **Wajah tidak dikenali**: Pastikan karyawan sudah diregistrasi
3. **Database error**: Periksa hak akses file `attendance.db`
4. **Koneksi CCTV gagal**: Periksa URL RTSP dan koneksi jaringan

### Masalah GPU
Jika GPU tidak terdeteksi:
1. Pastikan driver NVIDIA terinstal
2. Pastikan CUDA Toolkit terinstal
3. Periksa versi kompatibilitas dengan ONNX Runtime

### Masalah Database
Jika database bermasalah:
1. Backup file `attendance.db`
2. Hapus file `attendance.db` untuk membuat ulang
3. Registrasi ulang karyawan