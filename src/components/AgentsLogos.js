import React from 'react';

const AgentsLogos = ({ agentName = "Outreach", size = "Small" }) => {
  if (agentName === "Outreach" && size === "Small") {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0">
          <div className="absolute inset-0 rounded-[90px]"></div>
          <div className="absolute bottom-[3.637%] left-[2.697%] right-[2.241%] rounded-[152.113px] top-[3.435%]"></div>
        </div>
        <div className="absolute bottom-[15.348%] left-[16.001%] right-[15.347%] top-[16%]">
          <div className="absolute bottom-[-31.317%] left-[-28.956%] right-[-28.956%] top-[-26.595%]">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-[29.706%] left-[29.335%] right-[29.705%] top-[29.333%] overflow-hidden">
          <div className="absolute inset-[4.167%]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path 
                d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" 
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default AgentsLogos; 