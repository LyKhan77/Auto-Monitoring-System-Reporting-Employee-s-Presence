component library (FLOW) :

<CCTV Page>

<sidebar navigation> [untuk navigasi page]
     |--- <CCTV Page Button>
     |--- <Report Page Button>

<LIVE CCTV CAM> [inferensi model AI pada dashboard monitoring yang terhubung dengan CCTV]

<sidebar employee tracker> [sidebar employee ini menampilkan/tracking employee yang terdeteksi, data employee diambil dari database]

<button cctv cam> -->> <live monitoring panel cctv> [button 1,2,3,.. itu untuk switch camera cctv]

<Report Page>

<Panel Card> [Kotak dengan sudut membulat yang mengelilingi elemen-elemen di dalamnya, seperti dropdown, input tanggal, dan tombol. Ini digunakan untuk mengelompokkan elemen-elemen yang memiliki fungsi terkait]
     |--- <Filter employee>-->> dropdown [untuk filter nama employee] 
     |--- <Date Picker> [Dua input untuk memilih tanggal awal dan akhir]
     |--- <Button Generate Report> -->> [generate file pdf,excel,csv] <Export Reports> [elemen untuk mengambil export pdf,excel,csv] 

<card/widget> [ringkasan data. Menampilkan metrik atau statistik utama dari employee yang keluar masuk ruangan]

<Employee Status Table> [menampilkan data dalam format baris dan kolom. isi dari employee status harus berdasarkan employee di database]

<Active Alert List Panel> [Seluruh elemen ini berfungsi sebagai list atau feed untuk menampilkan peringatan terbaru secara real-time dari employe yang keluar masuk]

<Export Reports Card> [hasil dari <Button Generate Report>]
    |--- <button export <PDF>, <Excel>, <CSV>>

