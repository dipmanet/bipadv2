import React from 'react';

export default function InnundationLegend() {
    return (
        <div style={{
            display: 'flex',
            position: 'fixed',
            left: 'calc(30% - 52px)',
            zIndex: 99999,
            alignItems: 'center',
            bottom: 30,
        }}
        >
            <span style={{ height: 15, width: 15, backgroundColor: '#d2691e' }
            }
            />
            <p style={{ color: 'white', marginLeft: 5 }}>Inundation Area</p>
        </div>
    );
}
