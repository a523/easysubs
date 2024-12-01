import { FC, useEffect, useState } from "react";
import { useUnit } from "effector-react";
import Draggable from "react-draggable";

import { $currentSubs } from "@src/models/subs";
import { $video, $wasPaused, wasPausedChanged } from "@src/models/videos";
import { TSub, TSubItem } from "@src/models/types";
import {
  $autoStopEnabled,
  $moveBySubsEnabled,
  $subsBackground,
  $subsBackgroundOpacity,
  $subsFontSize,
} from "@src/models/settings";
import {
  $findPhrasalVerbsPendings,
  subItemMouseEntered,
  subItemMouseLeft,
  $currentPhrasalVerb,
} from "@src/models/translations";
import { addKeyboardEventsListeners, removeKeyboardEventsListeners } from "@src/utils/keyboardHandler";
import { SubItemTranslation } from "./SubItemTranslation";
import { PhrasalVerbTranslation } from "./PhrasalVerbTranslation";
import { SubFullTranslation } from "./SubFullTranslation";
import { WordTranslationPopup } from "./WordTranslationPopup";

type TSubsProps = {};

export const Subs: FC<TSubsProps> = () => {
  const [video, currentSubs, subsFontSize, moveBySubsEnabled, wasPaused, handleWasPausedChanged, autoStopEnabled] =
    useUnit([$video, $currentSubs, $subsFontSize, $moveBySubsEnabled, $wasPaused, wasPausedChanged, $autoStopEnabled]);

  useEffect(() => {
    if (moveBySubsEnabled) {
      addKeyboardEventsListeners();
    }
    return () => {
      removeKeyboardEventsListeners();
    };
  }, []);

  const handleOnMouseLeave = () => {
    if (wasPaused) {
      video.play();
      console.log("handleWasPausedChanged false");
      handleWasPausedChanged(false);
    }
  };

  const handleOnMouseEnter = () => {
    if (!autoStopEnabled) {
      return;
    }
    if (!video.paused) {
      console.log("handleWasPausedChanged true");

      handleWasPausedChanged(true);
      video.pause();
    }
  };

  return (
    <Draggable handle=".drag-handle">
      <div
        id="es-subs"
        onMouseLeave={handleOnMouseLeave}
        onMouseEnter={handleOnMouseEnter}
        style={{ fontSize: `${((video.clientWidth / 100) * subsFontSize) / 30}px` }}
      >
        <div className="drag-handle" style={{ 
          height: '20px', 
          cursor: 'move',
          position: 'absolute',
          top: '-20px',
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '4px 4px 0 0'
        }}></div>
        {currentSubs.map((sub) => (
          <Sub sub={sub} />
        ))}
      </div>
    </Draggable>
  );
};

const Sub: FC<{ sub: TSub }> = ({ sub }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [subsBackground, subsBackgroundOpacity, findPhrasalVerbsPendings] = useUnit([
    $subsBackground,
    $subsBackgroundOpacity,
    $findPhrasalVerbsPendings,
  ]);

  const handleOnDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setShowTranslation(true);
  };

  if (findPhrasalVerbsPendings[sub.text]) {
    return null;
  }

  return (
    <div
      className="es-sub"
      onDoubleClick={handleOnDoubleClick}
      onMouseLeave={() => setShowTranslation(false)}
      style={{
        background: `rgba(0, 0, 0, ${subsBackground ? subsBackgroundOpacity / 100 : 0})`,
      }}
    >
      {sub.items.map((item, index) => (
        <SubItem subItem={item} index={index} />
      ))}
      {showTranslation && <SubFullTranslation text={sub.cleanedText} />}
    </div>
  );
};

type TSubItemProps = {
  subItem: TSubItem;
  index: number;
};

const SubItem: FC<TSubItemProps> = ({ subItem, index }) => {
  const [currentPhrasalVerb, handleSubItemMouseEntered, handleSubItemMouseLeft, findPhrasalVerbsPendings] = useUnit([
    $currentPhrasalVerb,
    subItemMouseEntered,
    subItemMouseLeft,
    $findPhrasalVerbsPendings,
  ]);
  const [showWordPopup, setShowWordPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleOnMouseLeave = () => {
    if (!showWordPopup) {
      handleSubItemMouseLeft();
    }
  };

  const handleOnMouseEnter = () => {
    handleSubItemMouseEntered(subItem.cleanedText);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setShowWordPopup(true);
  };

  return (
    <>
      <pre
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        className={`es-sub-item ${subItem.tag} ${
          currentPhrasalVerb?.indexes?.includes(index) ? "es-sub-item-highlighted" : ""
        }`}
        onClick={handleClick}
      >
        {subItem.text}
        {!findPhrasalVerbsPendings[subItem.cleanedText] && showWordPopup && (
          <WordTranslationPopup
            word={subItem.cleanedText}
            onClose={() => setShowWordPopup(false)}
            position={position}
          />
        )}
      </pre>
      <pre className="es-sub-item-space"> </pre>
    </>
  );
};
