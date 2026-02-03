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
                    const el = document.getElementById(previewId);
                    
                    // placeholder ID 찾기 (preview-X -> placeholder-X)
                    // 만약 previewId 자체가 'footer-logo'처럼 'preview'를 포함하지 않으면 자기 자신이 나오므로 체크 필요
                    const placeholderId = previewId.replace('preview', 'placeholder');
                    // ID가 바뀌지 않았다면 placeholder가 없는 것으로 간주 (자기 자신을 숨기지 않도록)
                    const placeholder = (previewId !== placeholderId) ? document.getElementById(placeholderId) : null;
                    
                    // 태그 종류에 따라 이미지 처리 방식 분기
                    if (el.tagName === 'IMG') {
                        // 로고 등 일반 IMG 태그
                        el.src = e.target.result;
                    } else {
                        // DIV 태그: 배경 이미지로 설정하여 비율 유지 및 크롭 (Cover) 효과 적용
                        el.style.backgroundImage = `url(${e.target.result})`;
                    }
                    
                    el.classList.remove('hidden');
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
