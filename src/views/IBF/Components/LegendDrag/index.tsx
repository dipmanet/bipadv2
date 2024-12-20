import React, { useState } from 'react';
import Draggable from 'react-draggable';

const LegendDrag = ({ children, defaultPosition }) => {
    const [forDrag, setForDrag] = useState(false);

    return (
        <div
            style={{
                height: forDrag ? '100vh' : 0,
                width: forDrag ? '97vw' : 100,
                backgroundColor: forDrag ? 'magenta' : '',
            }}
        >
            <Draggable
                grid={[25, 25]}
                bounds="parent"

                onStart={() => setForDrag(true)}

                onStop={() => setForDrag(false)}
            >
                <div style={{
                    position: 'absolute',
                    top: defaultPosition.y,
                    right: defaultPosition.x,
                }}
                >
                    {children}
                </div>
            </Draggable>
        </div>
    );
};

export default LegendDrag;
