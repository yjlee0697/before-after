// 날짜 동기화
        const dateInput = document.getElementById('input-date');
        const dateDisplay = document.getElementById('display-date');

        dateInput.addEventListener('input', function() {
            dateDisplay.innerText = this.value || '';
        });

        // 오늘 날짜 기본 설정
        dateInput.valueAsDate = new Date();
        dateDisplay.innerText = dateInput.value;

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
                    if (placeholder) placeholder.classList.add('hidden');
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
                    const date = document.getElementById('input-date').value;
                    
                    link.download = `cleaning_report_vertical_${date}.png`;
                    link.href = generatedCanvas.toDataURL('image/png', 1.0);
                    link.click();

                    toast.classList.add('opacity-0', 'translate-y-4');
                    toast.classList.remove('opacity-100', 'translate-y-0');
                } catch (error) {
                    console.error('다운로드 오류:', error);
                    toast.classList.add('opacity-0');
                }
            }, 800); 
        }

        function resetAll() {
            if (confirm('모든 내용을 새로 작성하시겠습니까?')) {
                location.reload();
            }
        }
