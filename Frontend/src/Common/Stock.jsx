export default function Stock({ value }) {
    return (
        <div>
            {value <= 0 ? (
                <span style={{
                    color: 'red', fontSize: '20px',
                }}>Hors stock</span>
            ) : (
                <div>
                    <span style={{
                        fontSize: '20px',
                        color: value < 10 ? 'orange' : 'green'
                    }}>
                        {value} Units </span> IN STOCK
                </div>
            )}
        </div>
    );
}
