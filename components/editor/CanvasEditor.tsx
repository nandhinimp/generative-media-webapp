"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Konva from "konva";
import { Image as KonvaImage, Layer, Stage, Text, Transformer } from "react-konva";
import { EditorCanvasSize, EditorImageTransform, EditorMode, EditorTextItem } from "@/types/editor";

type Props = {
  imageUrl: string;
  canvasSize: EditorCanvasSize;
  stageRef: React.RefObject<Konva.Stage | null>;
  imageTransform: EditorImageTransform;
  selectedMode: EditorMode;
  selectedTextId: string | null;
  textItems: EditorTextItem[];
  onSelectMode: (mode: EditorMode, textId?: string) => void;
  onImageChange: (patch: Partial<EditorImageTransform>) => void;
  onTextChange: (id: string, patch: Partial<EditorTextItem>) => void;
};

export default function CanvasEditor({
  imageUrl,
  canvasSize,
  stageRef,
  imageTransform,
  selectedMode,
  selectedTextId,
  textItems,
  onSelectMode,
  onImageChange,
  onTextChange,
}: Props) {
  const imageNodeRef = useRef<Konva.Image | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const textNodeRefs = useRef<Record<string, Konva.Text | null>>({});
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setLoadedImage(null);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => setLoadedImage(img);
    img.onerror = () => setLoadedImage(null);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!loadedImage || imageTransform.initialized) return;

    const fitScale = Math.min(
      (canvasSize.width - 120) / loadedImage.width,
      (canvasSize.height - 120) / loadedImage.height,
      1
    );

    onImageChange({
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      scale: fitScale,
      rotation: 0,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      cropLeft: 0,
      cropTop: 0,
      cropRight: 0,
      cropBottom: 0,
      initialized: true,
    });
  }, [canvasSize.height, canvasSize.width, imageTransform.initialized, loadedImage, onImageChange]);

  const activeFilters = useMemo(() => {
    const filters = [];

    if (imageTransform.brightness !== 0) filters.push(Konva.Filters.Brighten);
    if (imageTransform.contrast !== 0) filters.push(Konva.Filters.Contrast);
    if (imageTransform.saturation !== 0) filters.push(Konva.Filters.HSL);

    return filters;
  }, [imageTransform.brightness, imageTransform.contrast, imageTransform.saturation]);

  useEffect(() => {
    const imageNode = imageNodeRef.current;
    if (!imageNode) return;

    if (activeFilters.length === 0) {
      if (imageNode.isCached()) {
        imageNode.clearCache();
      }
      imageNode.getLayer()?.batchDraw();
      return;
    }

    if (!imageNode.isCached()) {
      imageNode.cache({ pixelRatio: 1 });
    }

    imageNode.getLayer()?.batchDraw();
  }, [activeFilters, loadedImage]);

  const cropRegion = useMemo(() => {
    if (!loadedImage) return null;

    const cropLeft = Math.max(0, Math.min(0.45, imageTransform.cropLeft));
    const cropTop = Math.max(0, Math.min(0.45, imageTransform.cropTop));
    const cropRight = Math.max(0, Math.min(0.45, imageTransform.cropRight));
    const cropBottom = Math.max(0, Math.min(0.45, imageTransform.cropBottom));

    const width = Math.max(1, loadedImage.width * (1 - cropLeft - cropRight));
    const height = Math.max(1, loadedImage.height * (1 - cropTop - cropBottom));

    return {
      x: loadedImage.width * cropLeft,
      y: loadedImage.height * cropTop,
      width,
      height,
    };
  }, [imageTransform.cropBottom, imageTransform.cropLeft, imageTransform.cropRight, imageTransform.cropTop, loadedImage]);

  useEffect(() => {
    const transformer = transformerRef.current;
    if (!transformer) return;

    if (selectedMode === "image" && imageNodeRef.current) {
      transformer.nodes([imageNodeRef.current]);
    } else if (selectedMode === "text" && selectedTextId) {
      const node = textNodeRefs.current[selectedTextId];
      transformer.nodes(node ? [node] : []);
    } else {
      transformer.nodes([]);
    }

    transformer.getLayer()?.batchDraw();
  }, [selectedMode, selectedTextId, textItems]);

  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-white/8 bg-black shadow-2xl">
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="bg-black"
        onMouseDown={(event) => {
          if (event.target === event.target.getStage()) {
            onSelectMode("image");
          }
        }}
        onTouchStart={(event) => {
          if (event.target === event.target.getStage()) {
            onSelectMode("image");
          }
        }}
      >
        <Layer>
          {loadedImage && (
            <KonvaImage
              ref={imageNodeRef}
              image={loadedImage}
              x={imageTransform.x}
              y={imageTransform.y}
              offsetX={loadedImage.width / 2}
              offsetY={loadedImage.height / 2}
              scaleX={imageTransform.scale}
              scaleY={imageTransform.scale}
              rotation={imageTransform.rotation}
              draggable
              crop={cropRegion ?? undefined}
              filters={activeFilters}
              brightness={imageTransform.brightness}
              contrast={imageTransform.contrast}
              saturation={imageTransform.saturation}
              onMouseDown={() => onSelectMode("image")}
              onTouchStart={() => onSelectMode("image")}
              onDragEnd={(event) => {
                onImageChange({ x: event.target.x(), y: event.target.y() });
              }}
              onTransformEnd={() => {
                const node = imageNodeRef.current;
                if (!node) return;

                onImageChange({
                  x: node.x(),
                  y: node.y(),
                  scale: node.scaleX(),
                  rotation: node.rotation(),
                });
              }}
            />
          )}

          {textItems.map((item) => (
            <Text
              key={item.id}
              ref={(node) => {
                textNodeRefs.current[item.id] = node;
              }}
              text={item.text}
              x={item.x}
              y={item.y}
              width={item.width}
              fontSize={item.fontSize}
              fill={item.color}
              fontStyle={item.fontStyle}
              rotation={item.rotation}
              draggable
              shadowColor="rgba(0,0,0,0.6)"
              shadowBlur={8}
              shadowOffsetX={2}
              shadowOffsetY={2}
              onMouseDown={() => onSelectMode("text", item.id)}
              onTouchStart={() => onSelectMode("text", item.id)}
              onDragEnd={(event) => {
                onTextChange(item.id, { x: event.target.x(), y: event.target.y() });
              }}
              onTransformEnd={() => {
                const node = textNodeRefs.current[item.id];
                if (!node) return;

                const scaleX = node.scaleX();
                const scaleY = node.scaleY();

                onTextChange(item.id, {
                  x: node.x(),
                  y: node.y(),
                  width: Math.max(120, node.width() * scaleX),
                  fontSize: Math.max(14, item.fontSize * scaleY),
                  rotation: node.rotation(),
                });

                node.scaleX(1);
                node.scaleY(1);
              }}
            />
          ))}

          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={[
              "top-left",
              "top-center",
              "top-right",
              "middle-left",
              "middle-right",
              "bottom-left",
              "bottom-center",
              "bottom-right",
            ]}
            boundBoxFunc={(oldBox, newBox) => {
              if (newBox.width < 50 || newBox.height < 50) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
