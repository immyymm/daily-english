import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { SpellingKeyboard } from './SpellingKeyboard';

function Harness() {
  const [value, setValue] = useState('');
  return <SpellingKeyboard value={value} onChange={setValue} />;
}

describe('SpellingKeyboard', () => {
  it('collects a spelling answer without opening an editable system text field', () => {
    render(<Harness />);

    const answer = screen.getByLabelText('当前拼写答案');
    expect(answer).toHaveAttribute('readonly');
    expect(answer).toHaveAttribute('inputmode', 'none');
    expect(answer).toHaveAttribute('autocomplete', 'off');
    expect(answer).toHaveAttribute('autocorrect', 'off');
    expect(answer).toHaveAttribute('spellcheck', 'false');

    fireEvent.click(screen.getByRole('button', { name: '输入字母 m' }));
    fireEvent.click(screen.getByRole('button', { name: '输入字母 a' }));
    expect(answer).toHaveValue('ma');

    fireEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(answer).toHaveValue('m');
    fireEvent.click(screen.getByRole('button', { name: '清空' }));
    expect(answer).toHaveValue('');
  });
});
