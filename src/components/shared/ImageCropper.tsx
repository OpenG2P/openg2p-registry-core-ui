'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { X, Minus, Plus, RotateCw } from 'lucide-react';
import getCroppedImg from '@/shared/utils/cropImage';

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(1);
    const [inputWidth, setInputWidth] = useState<number>(1);
    const [inputHeight, setInputHeight] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    useEffect(() => {
        if (inputWidth > 0 && inputHeight > 0) {
            setAspect(inputWidth / inputHeight);
        }
    }, [inputWidth, inputHeight]);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((_ref: Area, _croppedAreaPixels: Area) => {
        setCroppedAreaPixels(_croppedAreaPixels);
    }, []);

    const handleApply = async () => {
        try {
            if (croppedAreaPixels) {
                const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
                if (croppedImage) {
                    onCropComplete(croppedImage);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-[700px] bg-white rounded-[25px] overflow-hidden border-4 border-[#F2BA1A]">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6">
                    <h2 className="text-[#ED7C22] text-2xl font-bold font-roboto">Edit Image</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative mx-8 h-[350px] bg-[#3D3D00] rounded-[15px] overflow-hidden">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspect}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onRotationChange={setRotation}
                        onCropComplete={onCropCompleteCallback}
                    />
                </div>

                {/* Controls */}
                <div className="px-8 py-8 flex items-center gap-6 bg-gray-50/50 w-full">

                    {/* Zoom  */}
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Minus size={20} strokeWidth={3} className="border-2 border-gray-300 rounded-full p-0.5" />
                        </button>

                        <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div
                                className="absolute top-0 left-0 h-full bg-[#F2BA1A]"
                                style={{ width: `${((zoom - 1) / 2) * 100}%` }}
                            />
                        </div>

                        <button
                            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Plus size={20} strokeWidth={3} className="border-2 border-gray-300 rounded-full p-0.5" />
                        </button>
                    </div>

                    {/* Aspect Ratio*/}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-500 font-semibold">Width</span>
                        <input
                            type="number"
                            min="1"
                            value={inputWidth}
                            onChange={(e) => setInputWidth(Math.max(1, Number(e.target.value)))}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded outline-none focus:border-gray-500"
                        />

                        <span className="text-gray-400 font-bold">:</span>

                        <span className="text-xs text-gray-500 font-semibold">Height</span>
                        <input
                            type="number"
                            min="1"
                            value={inputHeight}
                            onChange={(e) => setInputHeight(Math.max(1, Number(e.target.value)))}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded outline-none focus:border-gray-500"
                        />
                    </div>

                    {/* Rotate */}
                    <button
                        onClick={() => setRotation((prev) => (prev + 90) % 360)}
                        className="text-gray-400 hover:text-[#ED7C22] transition-colors shrink-0"
                        title="Rotate 90°"
                    >
                        <RotateCw size={22} />
                    </button>

                    {/* Apply */}
                    <button
                        onClick={handleApply}
                        className="bg-black text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shrink-0"
                    >
                        Apply
                    </button>

                </div>



            </div>
        </div>
    );
}
