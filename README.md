# 🌉 Bootcamp-CCIP-Transfer

**Bootcamp-CCIP-Transfer** là một ứng dụng Web3 chuyển token xuyên chuỗi (cross-chain token transfer) được phát triển bằng **Next.js**, **TypeScript**, **viem**, và **wagmi**. Ứng dụng sử dụng **Chainlink CCIP (Cross-Chain Interoperability Protocol)** để đảm bảo các giao dịch xuyên chuỗi an toàn, minh bạch và bảo mật cao.

Dự án này được xây dựng trong khuôn khổ một Bootcamp học tập, với sự hỗ trợ đắc lực từ **ChatGPT-4o**, trình soạn thảo **Cursor**, và tinh thần sáng tạo không ngừng của cộng đồng Web3.

---

## 📺 Video hướng dẫn sử dụng Bootcamp-CCIP-Transfer

[![Xem trước video hướng dẫn](https://img.youtube.com/vi/cMiEtia7oLM/maxresdefault.jpg)](https://www.youtube.com/watch?v=cMiEtia7oLM)

---
https://docs.chain.link/ccip/tutorials/cross-chain-tokens/register-from-eoa-burn-mint-foundry
---

## 🚀 Tính năng chính

### 🔗 Chuyển token xuyên chuỗi với Chainlink CCIP

- Sử dụng **Chainlink CCIP** – giao thức tương tác xuyên chuỗi được thiết kế với **bảo mật cấp cao**.
- Gửi token từ **Base Sepolia** đến **Saigon Testnet** một cách mượt mà và minh bạch.
- Hỗ trợ **Fee Flexibility**: chọn thanh toán phí bằng native token (ETH) hoặc LINK token.

### ⚙️ Công nghệ hiện đại

- **Next.js 14** và **TypeScript** – Khung phát triển frontend tối ưu cho hiệu suất và trải nghiệm người dùng, giúp code an toàn, rõ ràng và dễ bảo trì.
- **wagmi v2** & **viem** – Công nghệ mới nhất cho kết nối Web3, hỗ trợ chuẩn hóa và dễ kiểm soát giao dịch.
- **Smart Contract chuẩn Chainlink** – đảm bảo tính tin cậy và bảo mật cao trong mỗi giao dịch.

### 💡 Trải nghiệm người dùng

- Giao diện đơn giản, dễ hiểu, phù hợp cả người mới bắt đầu và nhà phát triển chuyên sâu.
- Hiển thị số dư token, thực hiện approve, ước tính phí gas, và transfer chỉ với vài cú nhấp chuột.
- Hiển thị trạng thái giao dịch theo thời gian thực, phản hồi nhanh.

---

## 🔐 Chainlink CCIP là gì?

**Chainlink CCIP (Cross-Chain Interoperability Protocol)** là giao thức tiên tiến cho phép các hợp đồng thông minh tương tác với nhau trên nhiều blockchain khác nhau. CCIP cung cấp:

- ✅ **Tính năng giao dịch xuyên chuỗi an toàn và bảo mật cao** – sử dụng Mạng Oracle của Chainlink có tính tương tác cao giúp cho giao dịch được trao đổi một cách chính xác.
- ✅ **Mạng lưới quản lý rủi ro Risk Management Network (RMN)** – giúp theo dõi và tối ưu chi phí.
- ✅ **Khả năng mở rộng trong tương lai** – dễ dàng tích hợp thông điệp và dữ liệu từ nhiều chain khác nhau, không chỉ token.

Với Chainlink CCIP, bạn không cần phải lo lắng về việc triển khai các bridge phức tạp hoặc tự xây dựng hệ thống bảo mật chuỗi chéo.

---

## 🛠️ Cài đặt và chạy ứng dụng

```bash
# Clone repository
git clone https://github.com/thanhnhaweb3/bootcamp-cross-chain-token-2025.git
cd bootcamp-cross-chain-token-2025

---

# Cài đặt cho foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge install && npm install
forge compile

# Tạo file .env.local và thêm các biến môi trường như sau:
PRIVATE_KEY=
RPC_URL_FUJI=
RPC_URL_ARBITRUM_SEPOLIA=
RPC_URL_ETHEREUM_SEPOLIA=
RPC_URL_BASE_SEPOLIA=
RPC_URL_SAIGON_TESTNET=
ETHERSCAN_API_KEY=
ARBISCAN_API_KEY=
SNOWTRACE_API_KEY=
BASESCAN_API_KEY=

---

# Cài đặt dependencies cho frontend
npm install

# Chép địa chỉ token và biên dịch ứng dụng
npm run build

# Khởi chạy ứng dụng
npm start
