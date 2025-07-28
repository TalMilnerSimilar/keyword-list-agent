import React from 'react';

const Checkbox = ({ checked, indeterminate, onChange, className = '' }) => {
  return (
    <button
      className={`block cursor-pointer relative shrink-0 w-6 h-6 ${className}`}
      onClick={onChange}
    >
      {checked ? (
        // On state - Blue background with white checkmark
        <>
          <div className="absolute bg-[#3e74fe] inset-[12.5%] rounded-sm"></div>
          <div className="absolute bg-[#ffffff] bottom-[45.833%] left-[20.833%] right-[20.833%] rounded-[1px] top-[45.833%]"></div>
        </>
      ) : indeterminate ? (
        // Intermediate state - Blue background with white bar
        <>
          <div className="absolute bg-[#3e74fe] inset-[12.5%] rounded-sm"></div>
          <div className="absolute bg-[#ffffff] bottom-[45.833%] left-[20.833%] right-[20.833%] rounded-[1px] top-[45.833%]"></div>
        </>
      ) : (
        // Off state - Gray border
        <div className="absolute inset-[12.5%] border border-[#b6bec6] rounded-sm"></div>
      )}
    </button>
  );
};

export default Checkbox; 