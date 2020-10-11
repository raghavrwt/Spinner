import React, { useRef, useState, useEffect } from 'react'; 
import './canvas.css';

const containerWidth = 500;
const containerHeight = 500;

const spinnerStyle = {
    width: `${containerWidth}px`,
    height: `${containerHeight}px`
}

const labels = [
    'Better Luck Next Time',
    '2X Savings',
    '100 Cashback',
    '₹20',
    '₹50',
    '1.5X Savings',
    '2X Savings',
    '₹50',
];

const colors = [
    '#83314B',
    '#752B43',
    '#551E31',
    '#65243A',
    '#83314B',
    '#752B43',
    '#551E31',
    '#65243A',
];

const CanvasComponent = (props) => {
    const canvasRef = useRef(null);

    const [id, setId] = useState('');
    const [isMouseDown, setIsMouseDown] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d'); 
        initializeCanvas(canvas, context);  
    });

    const deg2rad = (deg) => {
        return deg * Math.PI/180;
    }

    const drawSlice = (ctx, deg, color, center, sliceDeg) => {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(center, center);
        ctx.arc(center, center, center, deg2rad(deg), deg2rad(deg+sliceDeg));
        ctx.lineTo(center, center);
        ctx.fill();
    }

    const drawText = (ctx, deg, text, center) => {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(deg2rad(deg));
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(text, 130, 10);
        ctx.restore();
    }

    const initializeCanvas = (canvas, context) => {

        let center = canvas.width / 2;
        let sliceDeg = 360 / labels.length
        let deg = 0;
        canvas.style.position = "relative";

        for(let i = 0; i < labels.length; i++){
            drawSlice(context, deg, colors[i], center, sliceDeg);
            drawText(context, deg+sliceDeg/2, labels[i], center);
            deg += sliceDeg;
        }
    }

    const onSpin = () => {
        setId('rotation-active');
        stopSpin();
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    const stopSpin = async () => {
        let random = Math.floor(Math.random() * 10000) + 1; 
        
        setTimeout(() => {
            setId('rotation-active rotation-stop');
        }, random);
        await sleep(random + 1000);
        console.log(Math.floor(random / 360));
        
    }

    const rotateAnticlockwise = () => {
        setIsMouseDown(true);
    }

    const stopRotation = () => {
        setIsMouseDown(false);
    }

    const rotation = (event) => {
        if(isMouseDown) {
            let canvasCurr = canvasRef.current;
            let canvasX = canvasCurr.offsetLeft + containerWidth/2;
            let canvasY = canvasCurr.offsetTop + containerHeight/2;
            canvasCurr.style.transform = "rotate(" + Math.atan2(event.pageY - canvasY, event.pageX - canvasX) + "rad)";
        }
    }

    return (
        <div className='spinner-wheel' style={spinnerStyle}>
            <canvas 
                className={id} 
                ref={canvasRef} 
                height={containerHeight} 
                width={containerWidth} 
                onMouseDown={rotateAnticlockwise}
                onMouseMove={rotation}
                onMouseUp={onSpin}
                onMouseLeave={stopRotation}
            />
            <button className='button-spin' onClick={onSpin}>Spin</button>
            <div className='pointer'>
                <div className='line-width'></div>
                <div className='arrow'></div>
            </div>
        </div>
    )
}

export default CanvasComponent;