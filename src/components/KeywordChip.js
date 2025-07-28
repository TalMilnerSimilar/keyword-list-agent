import React from 'react';

const KeywordChip = ({ keyword, onRemove }) => {
  return (
    <div className="bg-white flex items-center gap-2 pl-3 pr-1 py-0.5 rounded-[40px] shadow-md shrink-0">
      <span className="text-xs font-dm-sans text-text-primary">
        {keyword}
      </span>
      <button
        onClick={onRemove}
        className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
      >
        <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default KeywordChip; 