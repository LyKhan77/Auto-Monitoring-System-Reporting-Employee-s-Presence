# Penggunaan RTSP CCTV dalam Sistem Face Recognition

## Deskripsi
Dokumen ini menjelaskan cara menggunakan input RTSP dari CCTV dalam sistem face recognition. Sistem mendukung penggunaan kamera IP CCTV yang terhubung melalui jaringan untuk registrasi karyawan dan pengenalan wajah secara real-time.

## Konfigurasi RTSP Default
- **Username**: admin
- **Password**: gspe-intercon!
- **IP Address**: 192.168.0.64
- **Port**: 554
- **Stream Path**: /Channels/Stream1
- **URL Lengkap**: `rtsp://admin:gspe-intercon@192.168.0.64:554/Channels/Stream1`

## Fitur RTSP
1. **Registrasi Karyawan via RTSP**: Mendaftarkan karyawan baru menggunakan feed kamera CCTV
2. **Face Recognition via RTSP**: Mengenali karyawan secara real-time menggunakan feed kamera CCTV

## Penggunaan

### 1. Registrasi Karyawan menggunakan RTSP
1. Jalankan sistem: `python main.py`
2. Pilih opsi "1. Manage employee" di menu utama
3. Pilih opsi "2. Tambah karyawan (RTSP CCTV)" di menu manajemen karyawan
4. Masukkan nama karyawan baru
5. Masukkan URL RTSP (tekan Enter untuk menggunakan default: `rtsp://admin:gspe-intercon@192.168.0.64:554/Channels/Stream1`)
6. Arahkan wajah karyawan ke kamera CCTV
7. Tekan tombol 'c' untuk capture wajah
8. Tekan tombol 'q' untuk keluar dari mode registrasi

### 2. Face Recognition menggunakan RTSP
1. Jalankan sistem: `python main.py`
2. Pilih opsi "3. Jalankan face recognition (RTSP CCTV)" di menu utama
3. Masukkan URL RTSP (tekan Enter untuk menggunakan default: `rtsp://admin:gspe-intercon@192.168.0.64:554/Channels/Stream1`)
4. Sistem akan membuka window stream CCTV
5. Wajah yang dikenali akan ditampilkan dengan nama dan similarity score
6. Kehadiran akan dicatat ke database `attendance.db`
7. Tekan tombol 'q' untuk keluar dari mode face recognition

## Troubleshooting

### Masalah Koneksi RTSP
- **Error "Gagal membuka stream RTSP"**: 
  - Pastikan CCTV terhubung ke jaringan yang sama dengan komputer
  - Periksa kembali URL RTSP (IP address, port, path stream)
  - Pastikan tidak ada firewall yang memblokir koneksi RTSP

- **Error "Gagal membaca frame dari stream RTSP"**:
  - Koneksi jaringan mungkin terputus, periksa koneksi kamera CCTV
  - Restart kamera CCTV jika masalah berlanjut
  - Pastikan bandwidth jaringan mencukupi untuk stream video

### Masalah Pengenalan Wajah
- **Wajah tidak terdeteksi**:
  - Pastikan pencahayaan di area kamera CCTV cukup
  - Pastikan kamera CCTV dalam posisi optimal (tinggi dan sudut yang tepat)
  - Pastikan kualitas stream RTSP memadai untuk deteksi wajah

- **Wajah tidak dikenali**:
  - Pastikan karyawan sudah diregistrasi melalui RTSP atau webcam
  - Periksa kemiripan kondisi pencahayaan saat registrasi dan pengenalan
  - Sesuaikan threshold pengenalan melalui menu "Parameter tuning" jika diperlukan

## Format URL RTSP Umum
Format umum URL RTSP untuk kamera IP:
```
rtsp://[username]:[password]@[ip_address]:[port]/[path_stream]
```

Contoh:
- `rtsp://admin:gspe-intercon@192.168.0.64:554/Channels/Stream1` (dengan autentikasi)
- `rtsp://192.168.0.64:554/Channels/Stream1` (tanpa autentikasi)

Catatan: Jika menggunakan autentikasi, pastikan karakter khusus di password sudah di-encode dengan benar.

## Rekomendasi
1. Gunakan kamera CCTV dengan resolusi minimal 720p untuk hasil terbaik
2. Pastikan jaringan memiliki bandwidth yang cukup untuk stream video real-time
3. Tempatkan kamera CCTV pada posisi yang optimal untuk menangkap wajah dengan jelas
4. Hindari backlighting yang kuat yang dapat mempengaruhi kualitas deteksi wajah