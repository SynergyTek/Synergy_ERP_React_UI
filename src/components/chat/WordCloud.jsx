import { Wordcloud } from "@visx/wordcloud";
import { scaleLinear } from "@visx/scale";
import { useEffect, useState } from "react";
import { theme } from "config";

class WordData {
  text;
  value;

  constructor(text, value) {
    this.text = text;
    this.value = value;
  }
}

let primary = theme.extend.colors.primary;

export function WordCloud({ words, width, height, theme }) {
  const [textColors, setTextColors] = useState([]);
  const getCount = (text) => {
    let count = 0;
    for (let i = 0; i < words.length; i++) {
      if (words[i].includes(text)) {
        count++;
      }
    }
    return count;
  };
  let wordsData = words.map((e) => new WordData(e, getCount(e)));

  const min = Math.min(...wordsData.map((w) => w.value));
  const max = Math.max(...wordsData.map((w) => w.value));
  const sizes = Object.keys(Object.groupBy(wordsData, ({ value }) => value));

  const fontScale = scaleLinear({
    domain: [min, max],
    range: sizes.map((key) => parseInt(key) * 2 * 24),
  });

  useEffect(() => {
    if (theme === "dark") {
      setTextColors([
        primary["50"],
        primary["100"],
        primary["200"],
        primary["300"],
        primary["400"],
      ]);
    } else {
      setTextColors([
        primary["600"],
        primary["700"],
        primary["800"],
        primary["900"],
        primary["950"],
      ]);
    }
  }, [theme]);

  return (
    <div
      className="wordcloud h-full w-full overflow-auto rounded bg-primary-50 p-2
        dark:bg-primary-950"
    >
      <Wordcloud
        words={wordsData}
        width={width}
        height={height}
        font={"Impact"}
        padding={2}
        fontSize={(word) => fontScale(word.value)}
        random={() => Math.random()}
        spiral={"rectangular"}
        rotate={0}
      >
        {
          /**
           * @param {Object} cloudWords
           */
          (cloudWords) =>
            cloudWords.map((w, i) => (
              <text
                key={w.text}
                fill={textColors[i % textColors.length]}
                textAnchor={"middle"}
                transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                fontSize={w.size}
                fontFamily={w.font}
              >
                {w.text}
              </text>
            ))
        }
      </Wordcloud>
    </div>
  );
}
