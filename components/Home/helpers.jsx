export const getUrl = (chainId, transactionId) => {
  if (chainId === 5) {
    return `https://goerli.etherscan.io/tx/${transactionId}`;
  }
  return `https://etherscan.io/tx/${transactionId}`;
};

export const getToken = ({ tokenName, token }) => (
  <div className={`section ${tokenName}-section`}>
    <div className="info">
      <span className="token-name">{tokenName}</span>
      <span className="balance">{token || '--'}</span>
    </div>
  </div>
);
