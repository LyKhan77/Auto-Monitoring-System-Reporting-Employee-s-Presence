# FR_Input.py
## Face Recognition dari File Gambar atau Video

Script ini digunakan untuk melakukan face recognition pada file gambar (JPG/PNG) atau video (MP4) sebagai input, bukan menggunakan webcam secara real-time.

### Cara Penggunaan

#### 1. Penggunaan Dasar untuk Gambar
```bash
python FR_Input.py path/ke/gambar.jpg
```

#### 2. Penggunaan Dasar untuk Video
```bash
python FR_Input.py path/ke/video.mp4
```

#### 3. Dengan Output File Khusus
```bash
python FR_Input.py path/ke/gambar.jpg -o path/ke/hasil.jpg
python FR_Input.py path/ke/video.mp4 -o path/ke/hasil.mp4
```

#### 4. Dengan Threshold Khusus
```bash
python FR_Input.py path/ke/gambar.jpg -t 0.6
python FR_Input.py path/ke/video.mp4 -t 0.7
```

#### 5. Kombinasi Opsi
```bash
python FR_Input.py path/ke/gambar.jpg -o path/ke/hasil.jpg -t 0.7
python FR_Input.py path/ke/video.mp4 -o path/ke/hasil.mp4 -t 0.6
```

### Parameter

- `input_file`: Path ke file input (wajib)
- `-o`, `--output`: Path untuk menyimpan hasil (opsional)
- `-t`, `--threshold`: Threshold untuk pengenalan wajah (default: 0.5)

### Format File yang Didukung

#### Gambar:
- JPEG (.jpg, .jpeg)
- PNG (.png)

#### Video:
- MP4 (.mp4)

### Output

#### Untuk Gambar:
1. Mendeteksi semua wajah dalam gambar
2. Mengenali wajah yang sesuai dengan database karyawan
3. Menyimpan gambar hasil dengan bounding box dan label nama
4. Menampilkan hasil pengenalan di console
5. Menampilkan gambar hasil di window baru

#### Untuk Video:
1. Memproses setiap frame video
2. Mendeteksi dan mengenali wajah dalam setiap frame
3. Menyimpan video hasil dengan bounding box dan label nama
4. Menampilkan progress pemrosesan di console

### Contoh Penggunaan

```bash
# Pengenalan wajah dalam foto kelompok
python FR_Input.py foto_kelompok.jpg

# Pengenalan wajah dalam video
python FR_Input.py rekaman_cctv.mp4

# Pengenalan dengan threshold lebih tinggi untuk akurasi yang lebih ketat
python FR_Input.py foto_kelompok.jpg -t 0.7

# Simpan hasil dengan nama file khusus
python FR_Input.py foto_kelompok.jpg -o hasil_pengenalan.jpg
python FR_Input.py rekaman_cctv.mp4 -o hasil_pengenalan.mp4
```

### Catatan

- Pastikan karyawan sudah diregistrasi dalam database sebelum melakukan pengenalan
- Kualitas hasil pengenalan tergantung pada kualitas file input
- Semakin tinggi threshold, semakin ketat pengenalan wajah (lebih sedikit false positive)
- Semakin rendah threshold, semakin longgar pengenalan wajah (lebih banyak false positive)
- Untuk video, pemrosesan dapat memakan waktu lama tergantung durasi dan resolusi video