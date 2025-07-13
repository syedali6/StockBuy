import React, { useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Index = () => {
    const [wallet, setWallet] = useState({
        balanceUSD: 10000,
        eth: 0
    });

    const [buyTarget, setBuyTarget] = useState(null);
    const [ethPrice, setEthPrice] = useState(null);
    const [sellTarget, setSellTarget] = useState(null);
    const [buyInputValue, setBuyInputValue] = useState('');
    const [sellInputValue, setSellInputValue] = useState('');
    const [buyBtnLoader, setBuyBtnLoader] = useState(false);
    const [sellBtnLoader, setSellBtnLoader] = useState(false);

    const fetchETHPrice = async () => {
        const res = await fetch('http://localhost:5000/eth-price');
        const data = await res.json();
        return data.price;
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            const price = await fetchETHPrice();
            setEthPrice(price);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    let buyInterval = null;
    const handleBuyClick = async () => {
        setBuyBtnLoader(true);
        if (!buyTarget) {
            alert("Set a valid buy price first.");
            setSellBtnLoader(false);
            return;
        }

        const currentPrice = await fetchETHPrice();
        setEthPrice(currentPrice);

        // if (buyTarget < currentPrice) {
        //     alert(`Current price is $${currentPrice}. Waiting for price to drop to $${buyTarget}...`);
        // }

        if (buyInterval) {
            clearInterval(buyInterval);
        }

        buyInterval = setInterval(async () => {
            const price = await fetchETHPrice();
            setEthPrice(price);

            if (price <= buyTarget && wallet.balanceUSD >= price) {
                setWallet(prev => ({
                    balanceUSD: prev.balanceUSD - price,
                    eth: prev.eth + 1
                }));
                alert(`Bought 1 ETH at $${price}`);
                setBuyInputValue('');
                setBuyTarget(null);
                setBuyBtnLoader(false);
                clearInterval(buyInterval);
            }
        }, 5000);
    };

    let sellInterval = null;

    const handleSellClick = async () => {
        setSellBtnLoader(true);
        if (!sellTarget) {
            alert("Set a valid sell price first.");
            setSellBtnLoader(false);

            return;
        }
        const currentPrice = await fetchETHPrice();
        setEthPrice(currentPrice);

        // if (sellTarget > currentPrice) {
        //     alert(`Current price is $${currentPrice}. Waiting for price to rise to $${sellTarget}...`);
        // }

        if (wallet.eth <= 1) {
            alert("You Don't have a ethereum")
            setSellBtnLoader(false);
            return;
        }
        if (sellInterval) {
            clearInterval(sellInterval);
        }
        sellInterval = setInterval(async () => {
            const price = await fetchETHPrice();
            setEthPrice(price);
            if (price >= sellTarget && wallet.eth >= 1) {
                setWallet(prev => ({
                    balanceUSD: prev.balanceUSD + price,
                    eth: prev.eth - 1
                }));
                alert(`Sold 1 ETH at $${price}`);
                setSellTarget(null);
                setSellInputValue('')
                setSellBtnLoader(false);
                clearInterval(sellInterval);
            }
        }, 5000);
    };

    return (
        <>
            <nav class="navbar px-4">
                <div class="logo">
                </div>
                <ul class="nav-menu">
                    <li class="nav-item"><a href="#home" class="nav-link">Current ETH Price: {ethPrice ? `$${ethPrice}` : "Fetching..."}</a></li>

                    <li class="nav-item"><a href="#home" class="nav-link">{wallet.eth} ETH</a></li>
                    <li class="nav-item"><a href="#about" class="nav-link">${wallet.balanceUSD.toFixed(2)} USD</a></li>

                </ul>
            </nav>

            <div className="main-content-color">
                <div class="container">

                    <div class="login-content justify-content-center">
                        <div className="content-inside-box">
                            <h2 class="title text-white">crypto stock</h2>
                            <h5 className="text-white text-start">Buy Stock</h5>
                            <div className="d-flex gap-2">
                                <div className="w-100">
                                    <input
                                        type="number"
                                        value={buyInputValue}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setBuyInputValue(value);
                                            setBuyTarget(parseFloat(value));
                                        }}
                                        placeholder="Buy ETH"
                                    />
                                </div>
                                <div className="d-flex align-items-center">
                                    {!buyBtnLoader ?
                                        <Button variant="primary" className="btn-style" onClick={handleBuyClick}>Buy</Button>
                                        :
                                        <Button variant="primary" className="btn-style" >
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="visually-hidden">Loading...</span>
                                        </Button>
                                    }
                                </div>
                            </div>

                            <br />
                            <h5 className="text-white text-start">Sell Stock</h5>
                            <div className="d-flex gap-2 mb-3">
                                <div className="w-100">
                                    <input
                                        type="number"
                                        value={sellInputValue}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSellInputValue(value);
                                            setSellTarget(parseFloat(value))
                                        }}
                                        placeholder="Sell ETH"
                                    />
                                </div>
                                <div className="d-flex align-items-center">
                                    {!sellBtnLoader ?

                                        <Button variant="primary" className="btn-style" onClick={handleSellClick}>Sell</Button>
                                        :
                                        <Button variant="primary" className="btn-style" >
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            <span className="visually-hidden">Loading...</span>
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index;