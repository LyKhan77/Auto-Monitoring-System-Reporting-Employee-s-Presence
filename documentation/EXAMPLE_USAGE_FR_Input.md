# Contoh Penggunaan FR_Input.py

## Persiapan

1. Siapkan file dengan wajah nyata (JPG/PNG/MP4)
2. Pastikan karyawan sudah diregistrasi dalam database

## Contoh Penggunaan

### 1. Pengenalan Gambar
```bash
python FR_Input.py foto_karyawan.jpg
```

### 2. Pengenalan Video
```bash
python FR_Input.py rekaman_cctv.mp4
```

### 3. Dengan Output File Khusus
```bash
python FR_Input.py foto_karyawan.jpg -o hasil_foto.jpg
python FR_Input.py rekaman_cctv.mp4 -o hasil_video.mp4
```

### 4. Dengan Threshold Khusus
```bash
python FR_Input.py foto_karyawan.jpg -t 0.7
python FR_Input.py rekaman_cctv.mp4 -t 0.6
```

### 5. Kombinasi Opsi
```bash
python FR_Input.py foto_karyawan.jpg -o hasil_foto.jpg -t 0.6
python FR_Input.py rekaman_cctv.mp4 -o hasil_video.mp4 -t 0.7
```

## Hasil Output

### Untuk Gambar:
1. Gambar dengan bounding box dan label nama untuk setiap wajah yang dikenali
2. Informasi pengenalan di console
3. File gambar hasil (jika tidak ditentukan, akan dibuat otomatis dengan suffix "_result")

### Untuk Video:
1. Video dengan bounding box dan label nama untuk setiap wajah yang dikenali
2. Progress pemrosesan di console
3. File video hasil (jika tidak ditentukan, akan dibuat otomatis dengan suffix "_result")

## Catatan Penting

- File input harus memiliki kualitas yang cukup baik
- Wajah dalam file harus terlihat jelas dan tidak terlalu kecil
- Sistem hanya akan mengenali wajah yang sudah diregistrasi dalam database
- Threshold 0.5 adalah nilai default, bisa disesuaikan tergantung kebutuhan:
  - Threshold tinggi (0.7-0.8): Lebih akurat tapi bisa melewatkan beberapa wajah
  - Threshold rendah (0.3-0.4): Lebih sensitif tapi bisa menghasilkan false positive
- Untuk video, pemrosesan dapat memakan waktu lama tergantung durasi dan resolusi video