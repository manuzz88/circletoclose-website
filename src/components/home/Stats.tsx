import React from 'react';

type StatsProps = {
  totalEvents: number;
  totalLocations: number;
  totalMembers: number;
  satisfactionRate: number;
};

export default function Stats({
  totalEvents = 0,
  totalLocations = 0,
  totalMembers = 0,
  satisfactionRate = 0,
}: StatsProps) {
  return (
    <section className="py-20 bg-[#0f1114] border-t border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <StatItem 
            value={totalEvents} 
            label="Eventi Esclusivi" 
          />
          <StatItem 
            value={totalLocations} 
            label="Location di Prestigio" 
          />
          <StatItem 
            value={totalMembers} 
            label="Membri Selezionati" 
          />
          <StatItem 
            value={satisfactionRate} 
            label="Tasso di Soddisfazione" 
            suffix="%" 
          />
        </div>
      </div>
    </section>
  );
}

type StatItemProps = {
  value: number;
  label: string;
  suffix?: string;
};

function StatItem({ value, label, suffix = '' }: StatItemProps) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-light text-[#d4af37] tracking-wide mb-3">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-300 font-light tracking-wide">
        {label}
      </div>
    </div>
  );
}
