     // 날짜 동기화
        const dateInput = document.getElementById('input-date');
        const dateDisplay = document.getElementById('display-date');

        dateInput.addEventListener('input', function() {
            dateDisplay.innerText = this.value || '';
        });

        // 오늘 날짜 기본 설정
        dateInput.valueAsDate = new Date();
        dateDisplay.innerText = dateInput.value;

        // 레이아웃 변경 함수
        function changeLayout(type) {
            const grid = document.getElementById('image-grid');
            const btnHorizontal = document.getElementById('btn-horizontal');
            const btnVertical = document.getElementById('btn-vertical');
            const canvas = document.getElementById('report-canvas');

            if (type === 'horizontal') {
                // 그리드 변경
                grid.classList.add('grid-cols-2');
                grid.classList.remove('grid-cols-1');
                
                // 캔버스 폭 조정 (가로형)
                canvas.style.maxWidth = '1000px';

                // 버튼 스타일
                btnHorizontal.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-700', 'font-bold');
                btnHorizontal.classList.remove('border-slate-200', 'bg-white', 'text-slate-500', 'font-medium');
                
                btnVertical.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-700', 'font-bold');
                btnVertical.classList.add('border-slate-200', 'bg-white', 'text-slate-500', 'font-medium');
            } else {
                // 그리드 변경
                grid.classList.remove('grid-cols-2');
                grid.classList.add('grid-cols-1');

                // 캔버스 폭 조정 (세로형 - 모바일 최적화 느낌으로 살짝 좁게)
                canvas.style.maxWidth = '700px';

                // 버튼 스타일
                btnVertical.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-700', 'font-bold');
                btnVertical.classList.remove('border-slate-200', 'bg-white', 'text-slate-500', 'font-medium');
                
                btnHorizontal.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-700', 'font-bold');
                btnHorizontal.classList.add('border-slate-200', 'bg-white', 'text-slate-500', 'font-medium');
            }
        }

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
                    const layout = document.getElementById('image-grid').classList.contains('grid-cols-1') ? 'vertical' : 'horizontal';
                    
                    link.download = `cleaning_report_${layout}_${date}.png`;
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
