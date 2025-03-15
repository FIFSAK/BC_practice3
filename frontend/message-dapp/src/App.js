import React, { useState } from "react";
import { ethers } from "ethers";

// Замените на адрес вашего развернутого контракта
const contractAddress = "0xYOUR_CONTRACT_ADDRESS";
// ABI — массив описаний функций контракта
const abi = [
  "function storeMessage(string _content) public",
  "function getMessages(address user) public view returns (tuple(string content, address sender, uint256 timestamp)[])"
];

function App() {
  // Состояния для хранения адреса, введённого сообщения, истории сообщений и экземпляра контракта
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [contract, setContract] = useState(null);

  // Функция подключения кошелька MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      // Создаем провайдера через MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Запрашиваем аккаунты
      await window.ethereum.request({ method: "eth_requestAccounts" });
      // Получаем подписанта
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);
      // Создаем экземпляр контракта с подписантом
      const contractInstance = new ethers.Contract(contractAddress, abi, signer);
      setContract(contractInstance);
      // Загружаем сообщения
      loadMessages(contractInstance, signer);
    } else {
      alert("Пожалуйста, установите MetaMask!");
    }
  };

  // Функция отправки нового сообщения
  const sendMessage = async () => {
    if (!contract) return;
    try {
      // Вызываем функцию storeMessage смарт-контракта
      const tx = await contract.storeMessage(message);
      // Ждем подтверждения транзакции
      await tx.wait();
      // Обновляем историю сообщений
      loadMessages(contract);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  // Функция загрузки сообщений для текущего пользователя
  const loadMessages = async (contractInstance, signerParam) => {
    try {
      // Если signer не передан, используем контракт, уже связанный с подписантом
      const signer = signerParam || contractInstance.signer;
      const userAddress = await signer.getAddress();
      const msgs = await contractInstance.getMessages(userAddress);
      setMessages(msgs);
    } catch (error) {
      console.error("Ошибка при загрузке сообщений:", error);
    }
  };

  return (
      <div style={{ padding: "20px" }}>
        <h2>Message DApp</h2>
        <button onClick={connectWallet}>Connect MetaMask</button>
        {account && <p>Connected account: {account}</p>}
        <div>
          <input
              type="text"
              placeholder="Enter a new message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "300px", marginRight: "10px" }}
          />
          <button onClick={sendMessage}>Send Message</button>
        </div>
        <h3>Message History:</h3>
        <ul>
          {messages.map((msg, index) => (
              <li key={index}>
                {new Date(msg.timestamp * 1000).toLocaleString()}: {msg.content}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default App;
