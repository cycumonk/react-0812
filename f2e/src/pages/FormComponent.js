import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [submitResponseMessage, setSubmitResponseMessage] = useState('');
    const [uploadResponseMessage, setUploadResponseMessage] = useState('');
    const [fetchData, setFetchData] = useState('');
    const [fetchDataXHR, setFetchDataXHR] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // 用來存儲使用者選擇的檔案

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5001/api/v1/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: inputValue }),
        });

        const data = await response.json();
        setSubmitResponseMessage(data.message);
    };

    // 使用 fetch 取得資料
    const handleFetchData = async () => {
        const response = await fetch('http://localhost:5001/api/v1/test', {
            method: 'GET' // 默認方法
        });
        const data = await response.json();
        setFetchData(JSON.stringify(data));
    };

    // 使用 XMLHttpRequest 取得資料
    const handleFetchDataXHR = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5001/api/v1/test', true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                setFetchDataXHR(xhr.responseText);
            } else {
                console.error('Error:', xhr.statusText);
            }
        };

        xhr.onerror = function () {
            console.error('Request failed');
        };

        xhr.send();
    };

    // 處理檔案選擇事件
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // 將選擇的檔案存入狀態
    };

    // 處理檔案上傳事件
    const handleFileUpload = async () => {
        // 檢查是否有選擇檔案
        if (!selectedFile) {
            setUploadResponseMessage("請選擇一個檔案");
            return;
        }

        // 檢查文件類型是否為 .txt 或 .pdf
        const allowedTypes = ['application/pdf', 'text/plain'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setUploadResponseMessage('僅允許上傳 .txt 或 .pdf 檔案');
            return;
        }

        // 建立 FormData 物件，並將檔案附加到其中
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // 發送 POST 請求到後端進行檔案上傳
            const response = await fetch('http://localhost:5001/api/v1/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // 嘗試解析 JSON 格式的回應
                const result = await response.json();

                if (result && result.message) {
                    setUploadResponseMessage(result.message); // 顯示成功訊息
                } else {
                    setUploadResponseMessage('上傳失敗，未收到預期的回應');
                }
            } else {
                setUploadResponseMessage(`伺服器回應錯誤: ${response.statusText}`);
            }
        } catch (error) {
            console.error('上傳失敗:', error); // 處理上傳失敗的情況
            setUploadResponseMessage(`上傳失敗: ${error.message}`); // 顯示錯誤訊息
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="mb-3">
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="請輸入文字"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">送出</button>
                    </form>
                    {submitResponseMessage && <p className="alert alert-success">{submitResponseMessage}</p>} {/* 顯示提交的回應訊息 */}

                    <button onClick={handleFetchData} className="btn btn-secondary me-2">使用 Fetch 取得資料</button>
                    {fetchData && <p className="mt-2 alert alert-info">{fetchData}</p>}

                    <button onClick={handleFetchDataXHR} className="btn btn-secondary">使用 XMLHttpRequest 取得資料</button>
                    {fetchDataXHR && <p className="mt-2 alert alert-warning">{fetchDataXHR}</p>}

                    {/* 檔案上傳 */}
                    <div className="mt-4">
                        {/* 檔案選擇輸入框 */}
                        <input type="file" className="form-control" accept=".txt, .pdf" onChange={handleFileChange} />
                        {/* 上傳按鈕 */}
                        <button className="btn btn-success mt-2" onClick={handleFileUpload}>上傳檔案</button>
                    </div>
                    {uploadResponseMessage && <p className="mt-2 alert alert-info">{uploadResponseMessage}</p>} {/* 顯示上傳的回應訊息 */}
                </div>
            </div>
        </div>
    );
};

export default FormComponent;
