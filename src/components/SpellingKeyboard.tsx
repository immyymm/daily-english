interface SpellingKeyboardProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export function SpellingKeyboard({ value, disabled = false, onChange }: SpellingKeyboardProps) {
  return (
    <div className="spelling-entry">
      <input
        aria-label="当前拼写答案"
        value={value}
        readOnly
        inputMode="none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="使用下方键盘完整拼写"
        disabled={disabled}
      />
      <p>请自己完整拼写；本题不提供词汇联想或自动更正。</p>
      <div className="spelling-keyboard" aria-label="英文拼写键盘">
        {keyboardRows.map((row) => (
          <div className="spelling-keyboard-row" key={row.join('')}>
            {row.map((letter) => (
              <button
                type="button"
                key={letter}
                aria-label={`输入字母 ${letter}`}
                disabled={disabled}
                onClick={() => onChange(value + letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className="spelling-keyboard-actions">
          <button type="button" disabled={disabled || !value} onClick={() => onChange('')}>清空</button>
          <button type="button" disabled={disabled || !value} onClick={() => onChange(value.slice(0, -1))}>删除</button>
        </div>
      </div>
    </div>
  );
}
