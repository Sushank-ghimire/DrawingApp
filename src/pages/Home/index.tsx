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

  const [isDrawing, setIsDrawing] = useState<Boolean>(false);

  const [color, setColor] = useState("white");

  const [reset, setReset] = useState(false);

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

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (canvas) {
      canvas.style.background = "black";
      const context = canvas.getContext("2d");

      if (context) {
        context.beginPath();
        context.moveTo(e.nativeEvent.clientX, e.nativeEvent.clientY);
        setIsDrawing(true);
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");

      if (context) {
        context.strokeStyle = color;
        context.lineTo(e.nativeEvent.clientX, e.nativeEvent.clientY);
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

        // Draw the existing canvas content over the new background
        newContext.drawImage(canvas, 0, 0);

        // Trigger the download of the new canvas
        const link = document.createElement("a");
        link.href = newCanvas.toDataURL("image/png");
        const imageName = prompt("Enter the image name to download ? ");
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
        <Group className="z-20 gap-2 mx-auto flex flex-wrap">
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
      />
    </>
  );
};

export default index;
