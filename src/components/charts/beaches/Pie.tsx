import React, { ReactElement, use, useEffect, useRef, useState } from "react";
import { Text } from "@visx/text";
import { scaleLog } from "@visx/scale";
import Wordcloud from "@visx/wordcloud/lib/Wordcloud";

interface ExampleProps {
  width: number;
  height: number;
  data: WordData[];
}

export interface WordData {
  text: string;
  value: number;
}

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const fixedValueGenerator = () => 0.5;

type SpiralType = "archimedean" | "rectangular";

export default function Example({ width, height, data }: ExampleProps) {
  const [spiralType, setSpiralType] = useState<SpiralType>("archimedean");
  const container = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (container.current) {
        setSize({
          width: container.current.clientWidth,
          height: container.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [container]);

  const fontScale = scaleLog({
    domain: [Math.min(...data.map((w) => w.value)), Math.max(...data.map((w) => w.value))],
    range: [12, 60],
  });
  const fontSizeSetter = (datum: WordData) => fontScale(datum.value);

  return (
    <div ref={container} className="wordcloud">
      <div className="text-xl font-bold">Top Beaches</div>
      <Wordcloud
        words={data}
        width={size.width}
        height={size.height}
        fontSize={fontSizeSetter}
        font={"Impact"}
        padding={2}
        spiral={spiralType}
        rotate={0}
        random={fixedValueGenerator}
      >
        {(cloudWords) =>
          cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor={"middle"}
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))
        }
      </Wordcloud>
      <style jsx>{`
        .wordcloud {
          display: flex;
          flex-direction: column;
          user-select: none;
          width: 100%;
          height: 100%;
          min-height: 422px;
          max-height: 422px;
        }
        .wordcloud svg {
          margin: 1rem 0;
          cursor: pointer;
        }

        .wordcloud label {
          display: inline-flex;
          align-items: center;
          font-size: 14px;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}
