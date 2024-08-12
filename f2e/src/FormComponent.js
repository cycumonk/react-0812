// src/FormComponent.js
import React, { useState } from 'react';

const FormComponent = () => {
    const [inputValue, setInputValue] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

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
        </div>
    );
};

export default FormComponent;
