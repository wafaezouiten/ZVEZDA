export default function Price({ value, oldValue }) {
    return (
        <div>
            {value <= 0 ? (
                <span>Gratuit</span>
            ) : (
                <div
                >
                    <span style={{fontSize:'21px', color:'green'}}>
                        {value.toFixed(2)} MAD
                    </span>
                    {oldValue > value && (
                        <span style={{ textDecoration: 'line-through', marginLeft: '10px', fontSize:'12px',color:'red' }}>
                            {oldValue.toFixed(2)} MAD
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
