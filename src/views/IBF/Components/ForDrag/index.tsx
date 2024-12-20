import React, { useState } from 'react';
import Draggable from 'react-draggable';

interface Props{
    children: React.ReactNode;
    widthToggle: boolean;
    defaultPosition: {
        x: string;
        y: string;
    };
}

const ForDrag = ({ children, widthToggle, defaultPosition }: Props) => {
    const [forDrag, setForDrag] = useState(false);

    return (
        <div
            style={{
                height: forDrag ? '100vh' : 0,
                width: forDrag ? '97vw' : 100,
            }}
        >
            <Draggable
                grid={[25, 25]}
                bounds="parent"
                onStart={() => setForDrag(true)}
                onStop={() => setForDrag(false)}
            >
                <div
                    style={
                        {
                            position: 'absolute',
                            top: defaultPosition.y,
                            left: defaultPosition.x,
                            width: widthToggle ? '70px' : '320px',
                        }
                    }
                >
                    {children}
                </div>
            </Draggable>
        </div>
    );
};

export default ForDrag;
