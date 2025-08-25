# Parameter Sistem Face Recognition
## Navigasi dan Lokasi Parameter dalam Kode

### 1. Konfigurasi Utama
Lokasi: `main.py`
Bagian: Di awal file, setelah import statements

```python
# Spesifikasi Sistem Face Recognition
SYSTEM_SPECS = {
    "model": "InsightFace (Buffalo_L)",
    "detection_threshold": 0.5,
    "detection_size": (320, 320),
    "recognition_cooldown": 10,
    "bbox_smoothing_factor": 0.7,
    "providers": "CUDAExecutionProvider, CPUExecutionProvider",
    "fps_target": 30,
    "frame_skip": False,
    "multi_person": True
}
```

### 2. Penggunaan Parameter dalam Face Recognition
Lokasi: `main.py`
Fungsi: `FaceRecognitionSystem.recognize_faces()`

#### Threshold Pengenalan
```python
# Baris sekitar 200-210
if best_score > SYSTEM_SPECS['detection_threshold']:
```

#### Cooldown Pengenalan
```python
# Baris sekitar 180-185
recognition_cooldown = SYSTEM_SPECS['recognition_cooldown']
```

#### Faktor Smoothing Bounding Box
```python
# Baris sekitar 190-195
smoothing_factor = SYSTEM_SPECS['bbox_smoothing_factor']
```

### 3. Penggunaan Parameter dalam Inisialisasi Model
Lokasi: `main.py`
Fungsi: `FaceRecognitionSystem.__init__()`

#### Ukuran Deteksi
```python
# Baris sekitar 100-105
self.app.prepare(ctx_id=0, det_size=(320, 320))
```
Catatan: Nilai ini sebaiknya diambil dari SYSTEM_SPECS:
```python
det_size = SYSTEM_SPECS['detection_size']
self.app.prepare(ctx_id=0, det_size=det_size)
```

### 4. File Konfigurasi Eksternal
Lokasi: `parameter_config.json` (akan dibuat setelah tuning)

Format:
```json
{
    "model": "InsightFace (Buffalo_L)",
    "detection_threshold": 0.5,
    "detection_size": [320, 320],
    "recognition_cooldown": 10,
    "bbox_smoothing_factor": 0.7,
    "providers": "CUDAExecutionProvider, CPUExecutionProvider",
    "fps_target": 30,
    "frame_skip": false,
    "multi_person": true
}
```

### 5. Script Tuning Parameter
Lokasi: `parameter_tuning.py`

Fungsi utama:
- `load_parameter_config()` - Memuat konfigurasi dari file
- `save_parameter_config()` - Menyimpan konfigurasi ke file
- `display_current_parameters()` - Menampilkan parameter saat ini
- Fungsi tuning spesifik untuk setiap parameter

### 6. Cara Mengubah Parameter Secara Manual

1. **Melalui Script Tuning**:
   ```bash
   python parameter_tuning.py
   ```

2. **Secara Langsung di Kode**:
   - Edit dictionary `SYSTEM_SPECS` di `main.py`
   - Restart aplikasi untuk menerapkan perubahan

3. **Melalui File Konfigurasi**:
   - Edit `parameter_config.json` jika ada
   - Restart aplikasi untuk menerapkan perubahan

### 7. Deskripsi Parameter

| Parameter | Deskripsi | Default | Rekomendasi Tuning |
|-----------|-----------|---------|-------------------|
| `detection_threshold` | Threshold untuk deteksi wajah | 0.5 | 0.6-0.7 untuk deteksi lebih ketat |
| `detection_size` | Ukuran input untuk deteksi | (320,320) | (640,640) untuk akurasi lebih tinggi |
| `recognition_threshold` | Threshold untuk pengenalan wajah | 0.5 | 0.6-0.7 untuk pengenalan lebih akurat |
| `recognition_cooldown` | Jeda antar pencatatan kehadiran (detik) | 10 | Sesuai kebutuhan |
| `bbox_smoothing_factor` | Faktor smoothing bounding box | 0.85 | 0.8-0.95 untuk stabilitas lebih tinggi |
| `fps_target` | Target frame per second | 30 | Sesuai kemampuan hardware |
| `max_distance_threshold` | Threshold jarak untuk matching wajah (pixels) | 150 | 100-200 tergantung ukuran frame |
| `tracking_timeout` | Timeout untuk mempertahankan ID tracking (detik) | 3.0 | 2.0-5.0 tergantung kebutuhan |
| `embedding_similarity_threshold` | Threshold untuk matching berbasis embedding | 0.7 | 0.6-0.8 tergantung akurasi yang diinginkan |

### 8. Efek dari Perubahan Parameter

#### Meningkatkan Threshold (0.5 → 0.7)
- **Positif**: Mengurangi false positive
- **Negatif**: Bisa melewatkan wajah yang seharusnya terdeteksi

#### Meningkatkan Ukuran Deteksi ((320,320) → (640,640))
- **Positif**: Akurasi deteksi lebih tinggi
- **Negatif**: Kinerja lebih lambat

#### Meningkatkan Smoothing Factor (0.7 → 0.9)
- **Positif**: Bounding box lebih stabil
- **Negatif**: Responsivitas terhadap pergerakan cepat berkurang

#### Meningkatkan Tracking Timeout (1.0 → 3.0 detik)
- **Positif**: ID tracking lebih konsisten ketika wajah keluar-masuk kamera
- **Negatif**: Memori digunakan lebih lama untuk menyimpan history tracking

#### Meningkatkan Max Distance Threshold (100 → 150 pixels)
- **Positif**: Toleransi posisi lebih baik untuk matching wajah antar frame
- **Negatif**: Bisa menyebabkan mismatch jika terlalu tinggi

#### Meningkatkan Embedding Similarity Threshold (0.5 → 0.7)
- **Positif**: Matching berbasis karakteristik wajah lebih akurat
- **Negatif**: Bisa melewatkan wajah yang seharusnya cocok jika pencahayaan/pose berubah

### 9. Rekomendasi Tuning Berdasarkan Kasus Penggunaan

#### Untuk Lingkungan Kantor/Stabil:
- `detection_threshold`: 0.6
- `recognition_threshold`: 0.65
- `detection_size`: (640, 640)
- `bbox_smoothing_factor`: 0.9
- `max_distance_threshold`: 150
- `tracking_timeout`: 3.0
- `embedding_similarity_threshold`: 0.7

#### Untuk Lingkungan Dinamis/CCTV:
- `detection_threshold`: 0.5
- `recognition_threshold`: 0.55
- `detection_size`: (320, 320)
- `bbox_smoothing_factor`: 0.85
- `max_distance_threshold`: 150
- `tracking_timeout`: 3.0
- `embedding_similarity_threshold`: 0.65

#### Untuk Akurasi Maksimal:
- `detection_threshold`: 0.7
- `recognition_threshold`: 0.7
- `detection_size`: (1024, 1024)
- `bbox_smoothing_factor`: 0.95
- `max_distance_threshold`: 120
- `tracking_timeout`: 3.0
- `embedding_similarity_threshold`: 0.75