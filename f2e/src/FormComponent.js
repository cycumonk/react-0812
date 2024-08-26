import React, { useState } from 'react';

const FormComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [fetchData, setFetchData] = useState('');
    const [fetchDataXHR, setFetchDataXHR] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5005/api/v1/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: inputValue }),
        });

        const data = await response.json();
        setResponseMessage(data.message);
    };

    // 使用fetch取得資料
    const handleFetchData = async () => {
        const response = await fetch('http://localhost:5005/api/v1/test', {
            method: 'GET' // 默認方法
        });
        const data = await response.json();
        setFetchData(JSON.stringify(data));
    };

    // 使用xmlHttpRequst取得資料
    const handleFetchDataXHR = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:5005/api/v1/test', true);

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

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="請輸入文字"
                />
                <button type="submit">送出</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}

            <button onClick={handleFetchData}>使用 Fetch 取得資料</button>
            {fetchData && <p>{fetchData}</p>}

            <button onClick={handleFetchDataXHR}>使用 XMLHttpRequest 取得資料</button>
            {fetchDataXHR && <p>{fetchDataXHR}</p>}
        </div>
    );
};

export default FormComponent;
