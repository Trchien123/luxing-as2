import { useState, useEffect } from "react";
import axios from "axios";

const FetchTransactions = (address) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (!address) {
            setLoading(false);
            return;
        }

        const isBitcoinAddress = (addr) => /^[13]|bc1/.test(addr);
        const apiUrl = isBitcoinAddress(address)
            ? `http://localhost:5000/api/bitcoin/transactions/${address}`
            : `http://localhost:5000/api/transactions/${address}`;

        const fetchTransactions = async () => {
            try {
                const response = await axios.get(apiUrl);
                if (isMounted) {
                    const transactionsData = response.data.transactions || []; // Get only transactions
                    setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            isMounted = false;
        };
    }, [address]);

    return { transactions, loading, error };
};

export default FetchTransactions;
