        // 실시간 텍스트 동기화
        const inputs = {
            'input-brand': ['display-brand', 'footer-brand'],
            'input-client': ['display-client'],
            'input-date': ['display-date']
        };

        Object.keys(inputs).forEach(id => {
            document.getElementById(id).addEventListener('input', function() {
                const value = this.value;
                inputs[id].forEach(targetId => {
                    const el = document.getElementById(targetId);
                    if (id === 'input-client') {
                        el.innerText = '서비스 대상: ' + (value || '');
                    } else if (id === 'input-date') {
                        el.innerText = '작성일: ' + (value || '');
                    } else {
                        el.innerText = value || (id === 'input-brand' ? 'CLEANING REPORT' : '');
                    }
                });
            });
        });

        // 오늘 날짜 기본 설정
        document.getElementById('input-date').valueAsDate = new Date();
        document.getElementById('display-date').innerText = '작성일: ' + document.getElementById('input-date').value;

        // 이미지 처리 함수
        function handleImage(input, previewId) {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.getElementById(previewId);
                    const placeholder = document.getElementById(previewId.replace('preview', 'placeholder'));
                    
                    img.src = e.target.result;
                    img.classList.remove('hidden');
                    placeholder.classList.add('hidden');
                }
                reader.readAsDataURL(file);
            }
        }

        // 이미지로 다운로드
        async function downloadReport() {
            const canvasElement = document.getElementById('report-canvas');
            const toast = document.getElementById('toast');
            
            toast.classList.remove('opacity-0', 'translate-y-4');
            toast.classList.add('opacity-100', 'translate-y-0');

            setTimeout(async () => {
                try {
                    const generatedCanvas = await html2canvas(canvasElement, {
                        scale: 2,
                        backgroundColor: "#ffffff",
                        logging: false,
                        useCORS: true,
                        allowTaint: true
                    });

                    const link = document.createElement('a');
                    const clientName = document.getElementById('input-client').value || 'report';
                    const date = document.getElementById('input-date').value;
                    
                    link.download = `cleaning_report_${clientName}_${date}.png`;
                    link.href = generatedCanvas.toDataURL('image/png', 1.0);
                    link.click();

                    toast.classList.add('opacity-0', 'translate-y-4');
                    toast.classList.remove('opacity-100', 'translate-y-0');
                } catch (error) {
                    console.error('다운로드 오류:', error);
                    toast.classList.add('opacity-0');
                }
            }, 500);
        }

        function resetAll() {
            if (confirm('모든 내용을 새로 작성하시겠습니까?')) {
                location.reload();
            }
        }