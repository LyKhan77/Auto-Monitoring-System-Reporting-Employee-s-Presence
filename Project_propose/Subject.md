Subject and Goals

saya diminta perusahaan untuk membuat project Auto-monitoring & reporting for employee presence. 
tujuan dibuatnya sistem ini yaitu untuk mengotomatiskan proses pemantauan kehadiran karyawan di berbagai area operasional menggunakan kamera CCTV.
Sistem ini bertujuan untuk melacak dan mencatat kehadiran dan ketidakhadiran karyawan selama jam kerja. 
fungsi yang diharapkan meliputi deteksi real-time karyawan di area yang ditentukan (Face Recognition) dan 
notifikasi saat karyawan tidak berada di area kerja untuk waktu yang lama (misal lebih dari 5 menit). 
Laporan akan dihasilkan secara otomatis dan dikirim melalui WhatsApp ke Supervisor atau staf HR yang relevan. 

berikut detail-detail spesifiknya : 
1. integrasi module AI Face Recognition dengan sistem CCTV yang ada untuk melacak pergerakan kehadiran karyawan (available=masuk/terdeteksi dan off=keluar/tidak terdeteksi).
2. notifikasi real-time yang dikirim melalui WhatsApp ke supervisor jika karyawan keluar dari area yang dipantau lebih dari 5 menit. 
3. Laporan kehadiran harian atau real-time yang dapat diakses oleh HR melalui dashboard pada report page atau WhatsApp. 
4. Penggunaan pengenalan wajah atau pemindaian badge untuk identifikasi karyawan yang akurat. 
5. Antarmuka yang sederhana bagi supervisor untuk melacak pola kehadiran (saya pribadi prefer bahasa yang mudah seperti HTML/CSS). 
6. Sistem harus dapat diskalakan untuk mencakup beberapa area sesuai kebutuhan. 

Batasan Teknis : 
1. kamera CCTV harus dipasang dengan jarak optimal 3 meter untuk deteksi yang jelas. 
2. diperlukan integrasi dengan sistem absensi atau ERP yang ada. 
3. regulasi privasi harus diperhatikan saat mengimplementasikan sistem pemantauan ini. 

instruksi tambahan : 
1. test dari rekaman CCTV apakah muka dapat dikenali.
2. web interface compatible dengan logic sistem.
2. buat sistem untuk track berapa lama orang di luar jangkauan kamera dan kapan terakhir dilihat (misal: 6min ago).
3. perlu integrate notifikasi ke hierarki (jelaskan apa itu hierarki, hierarki perlu selesai).