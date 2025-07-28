import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const AcceptOrderPage = () => {
    const { orderId } = useParams();
    const [message, setMessage] = useState('Accepting order...');

    useEffect(() => {
        const agentId = new URLSearchParams(window.location.search).get('agent');

        if (!agentId) {
            setMessage('Error: Agent ID not provided.');
            return;
        }

        const acceptOrder = async () => {
            try {
                const response = await api.post(`/api/delivery/accept/${orderId}/?agent_id=${agentId}`);
                setMessage(response.data.message);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('An error occurred while accepting the order.');
                }
            }
        };

        acceptOrder();
    }, [orderId]);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{message}</h2>
        </div>
    );
};

export default AcceptOrderPage;
