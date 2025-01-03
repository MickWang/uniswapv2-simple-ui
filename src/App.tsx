import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config/wagmi";
import { WalletConnect } from "./components/WalletConnect";
import { Layout } from "./components/Layout";
import { SwapInterface } from "./components/SwapInterface";
import { LiquidityInterface } from "./components/LiquidityInterface";
import { TransactionHistory } from "./components/TransactionHistory";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router basename="/uniswapv2-simple-ui">
          <Layout>
            <Routes>
              <Route path="/" element={<SwapInterface />} />
              <Route path="/liquidity" element={<LiquidityInterface />} />
              <Route path="/history" element={<TransactionHistory />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
