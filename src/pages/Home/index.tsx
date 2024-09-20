import { useEffect, useRef, useState } from "react";
import { colors } from "@/constants";
import { ColorSwatch, Group } from "@mantine/core";
import { Button } from "@/components/ui/button";
import { MdOutlineFileDownload } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GrPowerReset } from "react-icons/gr";

const index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("white");
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        context.lineCap = "round";
        context.lineWidth = 3;
      }
    }
  }, []);

  useEffect(() => {
    const handleUnload = (e: any) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const getCoordinates = (
    e: MouseEvent | TouchEvent
  ): { x: number; y: number } => {
    if (
      e.type === "mousedown" ||
      e.type === "mousemove" ||
      e.type === "mouseup"
    ) {
      return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
    } else {
      return {
        x: (e as TouchEvent).touches[0].clientX,
        y: (e as TouchEvent).touches[0].clientY,
      };
    }
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const { x, y } = getCoordinates(e.nativeEvent);

      if (context) {
        canvas.style.background = "black";
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const { x, y } = getCoordinates(e.nativeEvent);

      if (context) {
        context.strokeStyle = color;
        context.lineTo(x, y);
        context.stroke();
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const downLoadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;
      const newContext = newCanvas.getContext("2d");

      if (newContext) {
        newContext.fillStyle = "black";
        newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
        newContext.drawImage(canvas, 0, 0);

        const link = document.createElement("a");
        link.href = newCanvas.toDataURL("image/png");
        const imageName =
          prompt("Enter the image name to download? ") || "drawing";
        link.download = `${imageName}.png`;
        link.click();
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-4 items-center justify-center mx-auto mt-2">
        <div className="z-40 mx-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  color="black"
                  className="bg-black mx-auto w-fit text-white z-40"
                  variant={"outline"}
                  onClick={() => setReset(true)}
                >
                  <GrPowerReset />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset the board</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Group className="z-20 gap-2 mt-8 mx-auto flex flex-wrap">
          {colors.map((color: string) => (
            <ColorSwatch
              onClick={() => setColor(color)}
              className={`cursor-pointer`}
              color={color}
              key={color}
            />
          ))}
        </Group>
        <div className="z-40 mx-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  color="black"
                  className="bg-black max-w-fit mx-auto text-white z-40"
                  variant={"outline"}
                  onClick={downLoadImage}
                >
                  <MdOutlineFileDownload />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download image you have drawn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <canvas
        className="w-full bg-black h-full absolute top-0 max-w-fit left-0"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing} // Touch events for mobile
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
      />
    </>
  );
};

export default index;
