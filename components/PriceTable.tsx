// components/PriceTable.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPricesFromAPI } from '../redux/slices/pricesSlice';

const PriceTable = () => {
    const dispatch = useDispatch();
    const prices = useSelector((state) => state.prices.data);
    const status = useSelector((state) => state.prices.status);
    const error = useSelector((state) => state.prices.error);

    useEffect(() => {
        dispatch(fetchPricesFromAPI());
        const interval = setInterval(() => {
            dispatch(fetchPricesFromAPI());
        }, 3000);

        return () => clearInterval(interval);
    }, [dispatch]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'failed') {
        return <p>Error: {error}</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price (USD)</th>
                    <th>Last Updated</th>
                </tr>
            </thead>
            <tbody>
                {prices.map((coin, index) => (
                    <tr key={index}>
                        <td>{coin.symbol}</td>
                        <td>$ {coin.price}</td>
                        <td>{new Date(coin.lastUpdated).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PriceTable;
