import { FC } from 'react';
import { useGate, useUnit } from 'effector-react';
import { $currentWordTranslation, WordTranslationsGate } from '@src/models/translations';

interface WordTranslationPopupProps {
  word: string;
  onClose: () => void;
  position: { x: number; y: number };
}

export const WordTranslationPopup: FC<WordTranslationPopupProps> = ({ word, onClose, position }) => {
  useGate(WordTranslationsGate, word);
  const [currentWordTranslation] = useUnit([$currentWordTranslation]);

  if (!currentWordTranslation || !Array.isArray(currentWordTranslation.translations)) {
    return null;
  }

  return (
    <div 
      className="word-translation-popup" 
      onClick={(e) => e.stopPropagation()}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      <div className="word-translation-popup__header">
        <h3>{word}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="word-translation-popup__content">
        <div className="translation">{currentWordTranslation.mainTranslation}</div>
        {currentWordTranslation.translations.map((trans) => (
          <div key={`${word}-${trans.word}-${trans.partOfSpeech}`} className="translation-item">
            <span className="part-of-speech">{trans.partOfSpeech}</span>
            <span className="word">{trans.word}</span>
          </div>
        ))}
      </div>
      <button className="add-to-dict-button">添加到生词本</button>
    </div>
  );
};
