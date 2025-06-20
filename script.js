document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const screens = document.querySelectorAll('.screen');
    const loginForm = document.getElementById('loginForm');
    const exitButtons = document.querySelectorAll('.exit-btn');
    
    // Datos de ejemplo
    const users = [
        { id: 1, email: 'operario@freshtrack.com', name: 'Juan Pérez', role: 'operario', active: true },
        { id: 2, email: 'supervisor@freshtrack.com', name: 'María García', role: 'supervisor', active: true },
        { id: 3, email: 'auditor@freshtrack.com', name: 'Carlos López', role: 'auditor', active: true },
        { id: 4, email: 'admin@freshtrack.com', name: 'Ana Martínez', role: 'admin', active: true }
    ];

    const reports = [
        { id: 'REP-2023-001', date: '2023-06-15', status: 'Completado', type: 'Inventario', content: 'Reporte de inventario mensual con todos los lotes actuales' },
        { id: 'REP-2023-002', date: '2023-06-16', status: 'En progreso', type: 'Temperaturas', content: 'Reporte de variación de temperaturas en los últimos 7 días' },
        { id: 'REP-2023-003', date: '2023-06-17', status: 'Completado', type: 'Auditoría', content: 'Reporte de auditoría de cumplimiento de normas FDA' }
    ];

    // Mostrar pantalla específica
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
        
        // Cargar datos específicos de cada pantalla
        if (screenId === 'adminScreen') {
            loadActiveUsers();
            loadNotificationUsers();
        } else if (screenId === 'supervisorScreen') {
            loadReportsList();
        } else if (screenId === 'auditorScreen') {
            loadNftList();
        } else if (screenId === 'operatorScreen') {
            loadSensorData();
        }
    }
    
    // Manejar login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        
        // Simulación de autenticación
        if (password === '1234') {
            if (email.includes('operario')) {
                showScreen('operatorScreen');
            } else if (email.includes('supervisor')) {
                showScreen('supervisorScreen');
            } else if (email.includes('auditor')) {
                showScreen('auditorScreen');
            } else if (email.includes('admin')) {
                showScreen('adminScreen');
            } else {
                alert('Rol no reconocido');
            }
        } else {
            alert('Credenciales incorrectas');
        }
    });
    
    // Botones de volver
    exitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen('loginScreen');
        });
    });
    
    // ========== FUNCIONALIDAD OPERARIO ==========
    const scanBtn = document.getElementById('scanBtn');
    if (scanBtn) {
        scanBtn.addEventListener('click', function() {
            startQRScan();
        });
    }
    
    function startQRScan() {
        // Simulación de escaneo QR
        const qrData = {
            lote: 'FTR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-001',
            producto: 'Fresas Orgánicas',
            temperatura: (4 + Math.random() * 3).toFixed(1) + '°C',
            humedad: (60 + Math.random() * 15).toFixed(0) + '%',
            fecha: new Date().toLocaleDateString()
        };
        
        displayScanResult(qrData);
    }
    
    function displayScanResult(data) {
        const scanData = document.getElementById('scanData');
        scanData.innerHTML = `
            <p><strong>Lote:</strong> ${data.lote}</p>
            <p><strong>Producto:</strong> ${data.producto}</p>
            <p><strong>Temperatura:</strong> ${data.temperatura}</p>
            <p><strong>Humedad:</strong> ${data.humedad}</p>
            <p><strong>Fecha:</strong> ${data.fecha}</p>
        `;
        document.getElementById('scanResult').classList.remove('hidden');
    }
    
    function loadSensorData() {
        const sensorGrid = document.getElementById('sensorReadings');
        sensorGrid.innerHTML = '';
        
        const sensorData = [
            { id: 'P001', temp: (4 + Math.random() * 3).toFixed(1) + '°C', hum: (60 + Math.random() * 15).toFixed(0) + '%', status: Math.random() > 0.2 ? 'normal' : 'warning' },
            { id: 'P002', temp: (4 + Math.random() * 3).toFixed(1) + '°C', hum: (60 + Math.random() * 15).toFixed(0) + '%', status: Math.random() > 0.2 ? 'normal' : 'warning' },
            { id: 'P003', temp: (4 + Math.random() * 3).toFixed(1) + '°C', hum: (60 + Math.random() * 15).toFixed(0) + '%', status: Math.random() > 0.2 ? 'normal' : 'warning' }
        ];
        
        sensorData.forEach(sensor => {
            const sensorElement = document.createElement('div');
            sensorElement.className = `sensor-reading ${sensor.status === 'warning' ? 'warning' : ''}`;
            sensorElement.innerHTML = `
                <h4>Pallet ${sensor.id}</h4>
                <p>Temp: ${sensor.temp}</p>
                <p>Hum: ${sensor.hum}</p>
            `;
            sensorGrid.appendChild(sensorElement);
        });
    }
    
    // ========== FUNCIONALIDAD SUPERVISOR ==========
    function loadReportsList() {
        const reportsList = document.getElementById('reportsList');
        reportsList.innerHTML = '';
        
        reports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `
                <div class="report-info">
                    <span class="report-id">${report.id}</span>
                    <span class="report-date">${new Date(report.date).toLocaleDateString()}</span>
                    <span class="report-status ${report.status === 'Completado' ? 'verified' : 'pending'}">${report.status}</span>
                    <span>${report.type}</span>
                </div>
                <button class="view-report-btn primary-btn">Ver Reporte</button>
            `;
            reportsList.appendChild(reportItem);
        });
        
        // Agregar eventos a los botones de ver reporte
        document.querySelectorAll('.view-report-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = this.parentNode.querySelector('.report-id').textContent;
                viewReportDetails(reportId);
            });
        });
    }
    
    function viewReportDetails(reportId) {
        const report = reports.find(r => r.id === reportId);
        if (report) {
            const modalContent = document.getElementById('reportModalContent');
            modalContent.innerHTML = `
                <p><strong>ID:</strong> ${report.id}</p>
                <p><strong>Fecha:</strong> ${new Date(report.date).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> ${report.status}</p>
                <p><strong>Tipo:</strong> ${report.type}</p>
                <div class="report-data" style="margin-top: 15px; padding: 10px; background: #f8fafc; border-radius: 5px;">
                    <h4>Contenido del Reporte</h4>
                    <p>${report.content}</p>
                </div>
            `;
            document.getElementById('reportModal').classList.add('active');
        }
    }
    
    // ========== FUNCIONALIDAD AUDITOR ==========
    function loadNftList() {
        const nftList = document.getElementById('nftList');
        nftList.innerHTML = '';
        
        const nfts = [
            { id: 'NFT#12345', lote: 'FTR-2023-06-15', status: 'Verificado', date: '2023-06-15' },
            { id: 'NFT#12346', lote: 'FTR-2023-06-16', status: 'Pendiente', date: '2023-06-16' }
        ];
        
        nfts.forEach(nft => {
            const nftItem = document.createElement('div');
            nftItem.className = 'nft-item';
            nftItem.innerHTML = `
                <span class="nft-id">${nft.id}</span>
                <span class="nft-lote">Lote: ${nft.lote}</span>
                <span class="nft-status ${nft.status === 'Verificado' ? 'verified' : 'pending'}">${nft.status}</span>
            `;
            nftList.appendChild(nftItem);
        });
    }
    
    const generateAuditReportBtn = document.getElementById('generateAuditReportBtn');
    if (generateAuditReportBtn) {
        generateAuditReportBtn.addEventListener('click', function() {
            const startDate = document.getElementById('auditStartDate').value;
            const endDate = document.getElementById('auditEndDate').value;
            
            if (!startDate || !endDate) {
                alert('Por favor seleccione ambas fechas');
                return;
            }
            
            // Simular generación de reporte
            setTimeout(() => {
                const auditReportResult = document.getElementById('auditReportResult');
                auditReportResult.innerHTML = `
                    <h4>Reporte de Auditoría Generado</h4>
                    <p><strong>Período:</strong> ${startDate} a ${endDate}</p>
                    <p><strong>Resultados:</strong></p>
                    <ul>
                        <li>15 registros auditados</li>
                        <li>2 anomalías detectadas</li>
                        <li>98% de cumplimiento</li>
                    </ul>
                    <button class="primary-btn" style="margin-top: 10px;">Descargar PDF</button>
                `;
                auditReportResult.classList.remove('hidden');
            }, 1500);
        });
    }
    
    // ========== FUNCIONALIDAD ADMIN ==========
    function loadActiveUsers() {
        const usersList = document.getElementById('activeUsersList');
        usersList.innerHTML = '';
        
        users.forEach(user => {
            if (user.active) {
                const userItem = document.createElement('div');
                userItem.className = 'user-list-item';
                userItem.innerHTML = `
                    <div>
                        <strong>${user.name}</strong>
                        <div>${user.email}</div>
                    </div>
                    <span class="user-role ${user.role}">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                `;
                usersList.appendChild(userItem);
            }
        });
    }
    
    function loadNotificationUsers() {
        const notificationList = document.getElementById('notificationUsersList');
        notificationList.innerHTML = '';
        
        users.forEach(user => {
            if (user.active) {
                const userItem = document.createElement('div');
                userItem.className = 'notification-user';
                userItem.innerHTML = `
                    <input type="checkbox" id="notify-user-${user.id}" checked>
                    <label for="notify-user-${user.id}">${user.name} (${user.email}) - ${user.role}</label>
                `;
                notificationList.appendChild(userItem);
            }
        });
    }
    
    // Enviar notificaciones
    const sendNotificationsBtn = document.getElementById('sendNotificationsBtn');
    if (sendNotificationsBtn) {
        sendNotificationsBtn.addEventListener('click', function() {
            const message = document.getElementById('notificationMessage').value;
            if (!message) {
                alert('Por favor ingrese un mensaje de notificación');
                return;
            }
            
            // Obtener usuarios seleccionados
            const selectedUsers = [];
            document.querySelectorAll('#notificationUsersList input[type="checkbox"]:checked').forEach(checkbox => {
                const userId = checkbox.id.replace('notify-user-', '');
                const user = users.find(u => u.id == userId);
                if (user) selectedUsers.push(user);
            });
            
            if (selectedUsers.length === 0) {
                alert('Seleccione al menos un usuario para notificar');
                return;
            }
            
            // Crear elemento de notificación
            const notificationId = 'notif-' + Date.now();
            const notificationItem = document.createElement('div');
            notificationItem.className = 'notification-item';
            notificationItem.id = notificationId;
            notificationItem.innerHTML = `
                <button class="delete-notification-btn" data-id="${notificationId}">×</button>
                <h4>Notificación enviada</h4>
                <p><strong>Mensaje:</strong> ${message}</p>
                <p><strong>Usuarios notificados (${selectedUsers.length}):</strong></p>
                <ul>
                    ${selectedUsers.map(user => `<li>${user.name} (${user.email})</li>`).join('')}
                </ul>
                <p><small>${new Date().toLocaleString()}</small></p>
            `;
            
            // Agregar al contenedor
            document.getElementById('notificationItemsContainer').appendChild(notificationItem);
            document.getElementById('notificationResult').classList.remove('hidden');
            
            // Limpiar campo de mensaje
            document.getElementById('notificationMessage').value = '';
            
            // Mostrar alerta de éxito
            alert(`Notificaciones enviadas a ${selectedUsers.length} usuarios`);
        });
    }

    // Eliminar notificaciones individuales
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-notification-btn')) {
            const notificationId = e.target.getAttribute('data-id');
            const notificationItem = document.getElementById(notificationId);
            if (notificationItem) {
                notificationItem.remove();
                
                // Ocultar el contenedor si no hay más notificaciones
                const container = document.getElementById('notificationItemsContainer');
                if (container.children.length === 0) {
                    document.getElementById('notificationResult').classList.add('hidden');
                }
            }
        }
    });
    
    // Cerrar modales
    document.getElementById('closeQrModal')?.addEventListener('click', function() {
        document.getElementById('qrModal').classList.remove('active');
    });
    
    document.getElementById('closeReportModal')?.addEventListener('click', function() {
        document.getElementById('reportModal').classList.remove('active');
    });
    
    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
});