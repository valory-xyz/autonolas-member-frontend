export const getToken = ({ tokenName, token }) => (
  <div className={`section ${tokenName}-section`}>
    <div className="info">
      <span className="token-name">{tokenName}</span>
      <span className="balance">{token || '--'}</span>
    </div>
  </div>
);
