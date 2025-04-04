const diaChiData = {
    "Kiên Giang": {
        "Châu Thành": [
            "Thị trấn Minh Lương",
            "Xã Giục Tượng",
            "Xã Vĩnh Hòa Hiệp",
            "Xã Vĩnh Hòa Phú",
            "Xã Minh Hòa",
            "Xã Bình An",
            "Xã Thạnh Lộc"
        ]
    }
};


window.onload = function () {
    // Hiển thị danh sách khách hàng
    const data = JSON.parse(localStorage.getItem('customerData')) || [];
    const tbody = document.querySelector("#dataTable tbody");

    // Kiểm tra nếu tbody không tồn tại
    if (!tbody) {
        console.error("Không tìm thấy bảng dữ liệu (#dataTable tbody)");
        return;
    }

    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='9'>Không có dữ liệu nào</td></tr>";
    } else {
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="check" data-index="${index}"></td>
                <td>${row.hoTen}</td>
                <td>${row.gioiTinh}</td>
                <td>${row.doTuoi}</td>
                <td>${row.soThanhVien}</td>
                <td>${row.loaiSim}</td>
                <td>${row.soDienThoai}</td>
                <td>${row.goiWifi}</td>
                <td>${row.Camera}</td>
                <td>${row.chiPhiWifi}</td>
                <td>${row.chiPhiData}</td>
                <td>${row.chiPhiCamera}</td>                
                <td>${row.diaChi}</td>
                <td>${row.hopCap}</td>                
            `;
            tbody.appendChild(tr);
        });
    }

    // Chỉ cập nhật combobox nếu đang ở trang index.html
    const tinhThanhElement = document.getElementById("tinhThanh");
    const quanHuyenElement = document.getElementById("quanHuyen");

    if (tinhThanhElement) {
        const tinhThanh = tinhThanhElement.value;
        if (tinhThanh) {
            capNhatQuanHuyen();
        }
    }

    if (quanHuyenElement) {
        const quanHuyen = quanHuyenElement.value;
        if (quanHuyen) {
            capNhatPhuongXa();
        }
    }
};




// Xóa khách hàng được chọn
function xoaKhachHang() {
    const data = JSON.parse(localStorage.getItem('customerData')) || [];
    const checkboxes = document.querySelectorAll('.check');

    const indicesToDelete = [];
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            indicesToDelete.push(parseInt(checkbox.getAttribute('data-index')));
        }
    });

    if (indicesToDelete.length === 0) {
        alert("Vui lòng chọn ít nhất một khách hàng để xóa.");
        return;
    }

    // Xóa các mục đã chọn
    const newData = data.filter((_, index) => !indicesToDelete.includes(index));
    localStorage.setItem('customerData', JSON.stringify(newData));

    alert("Khách hàng đã được xóa thành công.");
    location.reload(); // Tải lại trang để cập nhật dữ liệu
}

function dinhDangSoTien(input) {
    let giaTri = input.value.replace(/\D/g, '');
    if (giaTri) {
        input.value = Number(giaTri).toLocaleString('vi-VN');
    }
}


// Thêm 2 số 0 vào cuối số tiền (làm tròn đơn vị trăm)
function themHaiSoKhong(id) {
    const input = document.getElementById(id);
    let giaTri = parseInt(input.value.replace(/\D/g, '')) || 0;
    input.value = (giaTri * 100).toLocaleString('vi-VN');
}

// Thêm 3 số 0 vào cuối số tiền (làm tròn đơn vị nghìn)
function themBaSoKhong(id) {
    const input = document.getElementById(id);
    let giaTri = parseInt(input.value.replace(/\D/g, '')) || 0;
    input.value = (giaTri * 1000).toLocaleString('vi-VN');
}

// Đặt lại số tiền về 0
function resetTien(id) {
    document.getElementById(id).value = '';
}


// Chuyển sang trang chứa dữ liệu
function chuyenTrang() {
    window.location.href = 'data.html';
}

// Chuyển về trang nhập liệu
function chuyenVeNhapLieu() {
    window.location.href = 'index.html';
}



function xuatExcel() {
    const data = JSON.parse(localStorage.getItem('customerData')) || [];
    
    if (data.length === 0) {
        alert("Không có dữ liệu để xuất!");
        return;
    }

    // Chuyển dữ liệu thành mảng hai chiều (mô phỏng bảng Excel)
    const worksheetData = [
        ["Họ tên","Giới tính","Độ tuổi", "Số thành viên", "Loại SIM", "Số điện thoại", "Gói Wifi","Camera", "Chi phí Wifi", "Chi phí Data","Chi phí Camera", "Địa chỉ","Hộp cáp"]
    ];
    
    data.forEach(row => {
        worksheetData.push([
            row.hoTen,row.gioiTinh,row.doTuoi, row.soThanhVien, row.loaiSim, row.soDienThoai,
            row.goiWifi,row.Camera, row.chiPhiWifi, row.chiPhiData,row.chiPhiCamera, row.diaChi, row.hopCap
        ]);
    });

    // Tạo file Excel
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachKhachHang");

    // Xuất file
    XLSX.writeFile(workbook, "DanhSachKhachHang.xlsx");
}




function capNhatQuanHuyen() {
    const tinhThanh = document.getElementById("tinhThanh").value;
    const quanHuyenSelect = document.getElementById("quanHuyen");
    const phuongXaSelect = document.getElementById("phuongXa");

    quanHuyenSelect.innerHTML = '<option value="">Chọn quận/huyện</option>';
    phuongXaSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

    if (tinhThanh && diaChiData[tinhThanh]) {
        for (const quan in diaChiData[tinhThanh]) {
            quanHuyenSelect.innerHTML += `<option value="${quan}">${quan}</option>`;
        }
    }
}

function capNhatPhuongXa() {
    const tinhThanh = document.getElementById("tinhThanh").value;
    const quanHuyen = document.getElementById("quanHuyen").value;
    const phuongXaSelect = document.getElementById("phuongXa");

    phuongXaSelect.innerHTML = '<option value="">Chọn phường/xã</option>';

    if (tinhThanh && quanHuyen && diaChiData[tinhThanh][quanHuyen]) {
        diaChiData[tinhThanh][quanHuyen].forEach(phuong => {
            phuongXaSelect.innerHTML += `<option value="${phuong}">${phuong}</option>`;
        });
    }
}


function luuThongTin() {
    const data = JSON.parse(localStorage.getItem('customerData')) || [];
    
    const newData = {
        hoTen: document.getElementById('hoTen').value,
        gioiTinh: document.getElementById('gioiTinh').value,
        doTuoi: document.getElementById('doTuoi').value,
        soThanhVien: document.getElementById('soThanhVien').value,
        loaiSim: document.getElementById('loaiSim').value,
        soDienThoai: document.getElementById('soDienThoai').value,
        goiWifi: document.getElementById('goiWifi').value,
        Camera: document.getElementById('Camera').value,
        chiPhiWifi: document.getElementById('chiPhiWifi').value,
        chiPhiData: document.getElementById('chiPhiData').value,
        chiPhiCamera: document.getElementById('chiPhiCamera').value,
        hopCap: document.getElementById('hopCap').value,

        diaChi: `${document.getElementById('soNha').value}, 
                 ${document.getElementById('duongTo').value}, 
                 ${document.getElementById('khuPhoAp').value}, 
                 ${document.getElementById('phuongXa').value}, 
                 ${document.getElementById('quanHuyen').value}, 
                 ${document.getElementById('tinhThanh').value}`
    };

    data.push(newData);
    localStorage.setItem('customerData', JSON.stringify(data));
    alert("Thông tin đã được lưu!");
    
}

