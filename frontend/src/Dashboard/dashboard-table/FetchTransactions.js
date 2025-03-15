import { useState, useEffect } from "react";
import axios from "axios";

const FetchTransactions = (address, coin) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        if (!address) {
            setLoading(false);
            return;
        }

        const fetchTransactions = async () => {
            try {
                const response = await axios.get(`https://luxing-backend-ihhcjrwmr-huynh-trung-chiens-projects.vercel.app/api/transactions/${address}?coin=${coin}`);
                if (isMounted && coin === "bitcoin") {
                    const transactionsData = response.data.transactions || []; // Get only transactions
                    setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
                    setError(null);
                }
                if (isMounted && coin === "ethereum".toLowerCase()) {
                    setTransactions(Array.isArray(response.data) ? response.data : []);
                    setError(null);
                }
                if (isMounted && coin === "seelecoin") {
                    setTransactions(Array.isArray(response.data) ? response.data : []);
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
    }, [address, coin]);

    return { transactions, loading, error };
};

export default FetchTransactions;
