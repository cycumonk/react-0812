import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';


const FormComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [submitResponseMessage, setSubmitResponseMessage] = useState('');
    const [uploadResponseMessage, setUploadResponseMessage] = useState('');
    const [uploadResponseMessageXHR, setUploadResponseMessageXHR] = useState(''); // 新增用於XHR上傳的回應訊息狀態
    const [fetchData, setFetchData] = useState('');
    const [fetchDataXHR, setFetchDataXHR] = useState('');
    const [selectedFile, setSelectedFile] = useState(null); // 用來存儲使用者選擇的檔案
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedYearMonth, setSelectedYearMonth] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5001/api/v1/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Data: inputValue }),
        })
        const Data = await response.json();
        console.log('Response:', Data);
        setSubmitResponseMessage(Data.message);
    };

    const handleFetchData = async () => {
        const response = await fetch('http://localhost:5001/api/v1/test', {
            method: 'GET' // 默認方法
        });
        const data = await response.json();
        setFetchData(JSON.stringify(data));
    };

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

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]); // 將選擇的檔案存入狀態
    };

    // 使用fetch上傳檔案
    const handleFileUpload = async () => {
        if (!selectedFile) {
            return setUploadResponseMessage("請選擇一個檔案");
        }

        const allowedTypes = ['application/pdf', 'text/plain'];
        if (!allowedTypes.includes(selectedFile.type)) {
            return setUploadResponseMessage('僅允許上傳 .txt 或 .pdf 檔案');
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('http://localhost:5001/api/v1/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await handleResponse(response);
            setUploadResponseMessage(result);
        } catch (error) {
            console.error('上傳失敗:', error);
            setUploadResponseMessage(`上傳失敗: ${error.message}`);
        }
    };

    const handleResponse = async (response) => {
        if (response.ok) {
            const result = await response.json();
            return result && result.message
                ? result.message
                : '上傳失敗，未收到預期的回應';
        }
        return `伺服器回應錯誤: ${response.statusText}`;
    };


    // 使用 XMLHttpRequest 上傳檔案
    const handleFileUploadXHR = () => {
        if (!validateFile(selectedFile)) return;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:5001/api/v1/upload', true);

        xhr.onload = handleXhrLoad;
        xhr.onerror = handleXhrError;

        const formData = new FormData();
        formData.append('file', selectedFile);

        xhr.send(formData);
    };

    // 驗證檔案的有效性
    const validateFile = (file) => {
        if (!file) {
            setUploadResponseMessageXHR("請選擇一個檔案");
            return false;
        }

        const allowedTypes = ['application/pdf', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            setUploadResponseMessageXHR('僅允許上傳 .txt 或 .pdf 檔案');
            return false;
        }

        return true;
    };

    // 處理 XHR 載入完成
    const handleXhrLoad = function () {
        if (this.status >= 200 && this.status < 300) {
            processResponse(this.responseText);
        } else {
            setUploadResponseMessageXHR(`伺服器回應錯誤: ${this.statusText}`);
        }
    };

    // 處理伺服器回應
    const processResponse = (responseText) => {
        try {
            const result = JSON.parse(responseText);
            if (result && result.message) {
                setUploadResponseMessageXHR(result.message);
            } else {
                setUploadResponseMessageXHR('上傳失敗，未收到預期的回應');
            }
        } catch (error) {
            setUploadResponseMessageXHR('上傳失敗，無法解析伺服器回應');
        }
    };

    // 處理 XHR 錯誤
    const handleXhrError = () => {
        setUploadResponseMessageXHR('上傳失敗，請檢查網路連線或伺服器狀態');
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
                    {submitResponseMessage && <p className="alert alert-success">{submitResponseMessage}</p>}

                    <button onClick={handleFetchData} className="btn btn-secondary me-2">使用 Fetch 取得資料</button>
                    {fetchData && <p className="mt-2 alert alert-info">{fetchData}</p>}

                    <button onClick={handleFetchDataXHR} className="btn btn-secondary">使用 XMLHttpRequest 取得資料</button>
                    {fetchDataXHR && <p className="mt-2 alert alert-warning">{fetchDataXHR}</p>}

                    <div className="mt-5">
                        <input type="file" className="form-control" accept=".txt, .pdf" onChange={handleFileChange} />
                        <button className="btn btn-success mt-2" onClick={handleFileUpload}>上傳檔案 (Fetch)</button>
                        <button className="btn btn-info mt-2 ms-2" onClick={handleFileUploadXHR}>上傳檔案 (XHR)</button> {/* 新增的 XHR 上傳按鈕 */}
                    </div>
                    {uploadResponseMessage && <p className="mt-2 alert alert-info">{uploadResponseMessage}</p>}
                    {uploadResponseMessageXHR && <p className="mt-2 alert alert-warning">{uploadResponseMessageXHR}</p>} {/* 顯示 XHR 上傳的回應訊息 */}
                    <div className="mt-5">
                        <h2>選擇日期</h2>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="請選擇日期"
                        />
                        {selectedDate && <p>你選擇的日期是: {selectedDate.toDateString()}</p>}
                    </div>
                    <div className="mt-5">
                        <h2>選擇年月</h2>
                        <DatePicker
                            selected={selectedYearMonth}
                            onChange={(date) => setSelectedYearMonth(date)}
                            dateFormat="yyyy/MM"
                            placeholderText="請選擇年份和月份"
                            showMonthYearPicker
                        />
                        {selectedYearMonth && <p>你選擇的日期是: {selectedYearMonth.toDateString()}</p>}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FormComponent;
