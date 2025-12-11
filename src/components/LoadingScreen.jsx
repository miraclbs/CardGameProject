import Cursor from "./Cursor";

export default function LoadingScreen() {
    return (
        <>
            <Cursor />
            <div className="app">
                <div className="loading-container">
                    <h2>Hikaye başlıyor...</h2>
                    <div className="spinner"></div>
                </div>
            </div>
        </>
    );
}
