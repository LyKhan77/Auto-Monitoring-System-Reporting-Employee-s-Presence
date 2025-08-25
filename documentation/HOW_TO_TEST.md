# HOW_TO_TEST.md
# Panduan Testing Sistem Face Recognition

## Tujuan Testing
Mengujikan apakah sistem face recognition dapat:
1. Mendeteksi wajah dengan akurat menggunakan InsightFace
2. Membuat dan menyimpan embedding wajah ke database
3. Mencocokkan wajah dengan data karyawan yang sudah diregistrasi
4. Mencatat kehadiran ke database ketika wajah dikenali

## Prasyarat
1. Webcam laptop yang berfungsi
2. Pencahayaan yang cukup (tidak terlalu gelap atau terlalu terang)
3. Python dan dependencies sudah terinstal

## Langkah-langkah Testing

### 1. Verifikasi Instalasi
```bash
pip install -r requirements.txt
```

### 2. Testing Sistem
```bash
python test.py
```
Ini akan menjalankan serangkaian test untuk memastikan semua komponen berfungsi dengan baik.

### 3. Registrasi Karyawan (jika belum ada)
```bash
python main.py
```
Pilih opsi 1 untuk masuk ke menu manajemen karyawan, lalu pilih opsi 1 untuk menambah karyawan:
1. Masukkan nama karyawan baru
2. Arahkan wajah ke webcam
3. Tekan 'c' untuk capture wajah
4. Pastikan pesan sukses muncul dan gambar disimpan di `data/registered_faces/`

### 4. Testing Face Recognition
```bash
python main.py
```
Pilih opsi 2 untuk menjalankan face recognition:
1. Sistem akan membuka window webcam
2. Arahkan wajah ke webcam
3. Jika wajah dikenali, akan muncul nama karyawan dengan similarity score
4. Jika wajah tidak dikenali, akan muncul "Unknown"
5. Untuk keluar, tekan tombol 'q'

Atau jalankan langsung:
```bash
python run.py
```

### 5. Verifikasi Logging Attendance
Setelah wajah dikenali, sistem akan mencatat kehadiran ke database. Untuk memverifikasi:

1. Buka file `attendance.db` dengan DB browser SQLite atau tool sejenis
2. Periksa tabel `attendance` untuk melihat apakah record baru telah ditambahkan
3. Atau jalankan perintah berikut:
   ```bash
   python -c "from main import get_all_employees; employees = get_all_employees(); print(f'Jumlah karyawan: {len(employees)}')"
   ```

## Parameter yang Dapat Diuji

### Threshold Pengenalan Wajah
Dalam file `main.py`, terdapat parameter threshold di fungsi `recognize_faces`:
```python
if best_score > 0.5:
```

Nilai threshold menentukan seberapa mirip wajah harus agar dikenali:
- Semakin tinggi nilai (mendekati 1.0), semakin ketat pengenalan
- Semakin rendah nilai (mendekati 0.0), semakin longgar pengenalan

Coba ubah nilai ini untuk menguji akurasi sistem:
- Threshold 0.7: Sangat ketat, jarang salah kenal
- Threshold 0.5: Normal, keseimbangan antara akurasi dan sensitivitas
- Threshold 0.3: Longgar, lebih sering mengenali tapi bisa salah kenal

## Pengujian yang Disarankan

### 1. Pengujian dengan Karyawan yang Sudah Diregistrasi
- Gunakan wajah karyawan yang sudah diregistrasi
- Uji dari berbagai sudut dan jarak
- Uji dengan pencahayaan berbeda (terang, redup, dengan bayangan)

### 2. Pengujian dengan Orang yang Tidak Diregistrasi
- Gunakan wajah orang yang tidak diregistrasi
- Sistem harus menampilkan "Unknown"

### 3. Pengujian dengan Kondisi Berbeda
- Uji dengan atau tanpa kacamata
- Uji dengan pencahayaan berbeda
- Uji dengan jarak berbeda dari kamera

### 4. Pengujian Batas Sistem
- Uji dengan lebih dari satu orang dalam frame
- Uji dengan wajah yang sebagian tertutup
- Uji dengan wajah yang bergerak cepat

## Troubleshooting

### Masalah Umum dan Solusi

1. **Wajah tidak terdeteksi sama sekali**
   - Pastikan pencahayaan cukup
   - Pastikan wajah menghadap ke kamera
   - Periksa apakah webcam berfungsi dengan baik

2. **Wajah terdeteksi tapi tidak dikenali**
   - Coba kurangi nilai threshold di fungsi recognize_faces
   - Periksa apakah karyawan sudah diregistrasi dengan benar
   - Pastikan kondisi pencahayaan saat registrasi dan testing sama

3. **Wajah salah dikenali (mengenali orang lain sebagai karyawan)**
   - Tingkatkan nilai threshold di fungsi recognize_faces
   - Lakukan registrasi ulang dengan kualitas gambar yang lebih baik

4. **Sistem lambat atau frame rate rendah**
   - Kurangi resolusi kamera
   - Pastikan tidak ada aplikasi lain yang menggunakan banyak CPU

5. **Database tidak terupdate**
   - Periksa apakah file `attendance.db` dapat ditulis
   - Pastikan tidak ada error saat koneksi ke database

## Catatan Penting

1. **Jarak Optimal** - Untuk hasil terbaik, posisikan wajah sekitar 1-2 meter dari webcam
2. **Pencahayaan** - Gunakan pencahayaan yang merata, hindari cahaya langsung dari belakang
3. **Waktu Cooldown** - Sistem memiliki cooldown 10 detik antara pencatatan kehadiran untuk mencegah spam
4. **Satu Wajah** - Sistem dirancang untuk mendeteksi satu wajah dominan dalam frame

## Pengujian Lanjutan (Opsional)

Jika ingin menguji lebih lanjut:

1. **Uji Akurasi** - Hitung persentase pengenalan yang benar
2. **Uji Kecepatan** - Ukur waktu yang dibutuhkan untuk pengenalan wajah
3. **Uji Robustness** - Uji dengan berbagai kondisi lingkungan