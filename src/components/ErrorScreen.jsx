import Cursor from "./Cursor";

export default function ErrorScreen({ error, onRetry }) {
    return (
        <>
            <Cursor />
            <div className="app">
                <div className="error-container">
                    <h2>Hata Oluştu</h2>
                    <p>{error}</p>
                    <button onClick={onRetry}>Tekrar Dene</button>
                </div>
            </div>
        </>
    );
}
