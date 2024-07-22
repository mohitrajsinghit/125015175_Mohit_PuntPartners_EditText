import React, { useState, useEffect } from 'react';
import "./style.css";
import Switch from '@mui/material/Switch';
import FormatData from "./punt-frontend-assignment.json";

function App() {
  const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || 'Roboto');
  const [variant, setVariant] = useState(localStorage.getItem('variant') || 'Bold');
  const [text, setText] = useState(localStorage.getItem('text') || 'Hello World');
  const [isItalic, setIsItalic] = useState(localStorage.getItem('isItalic') === 'true');
  const [fontOptions, setFontOptions] = useState([]);
  const [currentFontData, setCurrentFontData] = useState({});
  const [isItalicAvailable, setIsItalicAvailable] = useState(false);

  useEffect(() => {
    const italicKey = `${variant}italic`;
    if (FormatData[fontFamily] && FormatData[fontFamily][italicKey]) {
      setIsItalicAvailable(true);
    } else {
      setIsItalicAvailable(false);
    }
  }, [fontFamily, variant]);

  useEffect(() => {
    const fonts = Object.keys(FormatData);
    setFontOptions(fonts);
  }, []);

  useEffect(() => {
    setCurrentFontData(FormatData[fontFamily] || {});
  }, [fontFamily]);

  useEffect(() => {
    if (fontFamily in FormatData) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [fontFamily]);

  useEffect(() => {
    localStorage.setItem('text', text);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('variant', variant);
    localStorage.setItem('isItalic', isItalic);
  }, [text, fontFamily, variant, isItalic]);

  const handleFontFamilyChange = (event) => {
    const newFontFamily = event.target.value;
    let newVariant = variant;

    if (FormatData[newFontFamily]) {
      if (!FormatData[newFontFamily][variant]) {
        const variants = Object.keys(FormatData[newFontFamily]);
        let foundVariant = null;

        if (isItalic) {
          foundVariant = variants.find(v => v.includes('italic'));
        }

        if (!foundVariant) {
          foundVariant = variants.find(v => !v.includes('italic'));
        }

        if (foundVariant) {
          newVariant = foundVariant;
        }
      }
    }
    setFontFamily(newFontFamily);
    setVariant(newVariant);
  };

  const handleVariantChange = (event) => {
    setVariant(event.target.value);
  };

  const handleItalicChange = () => {
    if (isItalicAvailable) {
      setIsItalic(!isItalic);
    }
  };

  const handleReset = () => {
    setFontFamily('Roboto');
    setVariant('Bold');
    setText('Hello World');
    setIsItalic(false);
  };

  const handleSave = () => {
    console.log('Saving text:', text);
  };

  const variants = Object.keys(currentFontData).map(key => {
    const parts = key.match(/^(\d+)(italic)?$/);
    if (parts) {
      return { weight: parts[1], italic: !!parts[2] };
    }
    return null;
  }).filter(variant => variant !== null);

  return (
    <div className="app">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="font-family">Font Family:</label>
          <select id="font-family" value={fontFamily} onChange={handleFontFamilyChange}>
            {fontOptions.map(font => (
              <option key={font} value={font}>{font}</option>
            ))}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="variant">Variant:</label>
          <select id="variant" value={variant} onChange={handleVariantChange}>
            {variants.map(({ weight, italic }) => (
              <option key={`${weight}${italic ? 'italic' : ''}`} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="italic">Italic:</label>
          <Switch checked={isItalic} onChange={handleItalicChange} disabled={!isItalicAvailable} className='switch'/>
        </div>
      </div>
      
      <div className="text-editor">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          style={{
            fontFamily,
            fontWeight: variant,
            fontStyle: isItalic ? 'italic' : 'normal',
          }}
        />
      </div>
      <div className="buttons">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default App;
