import * as React from "react";

interface StatsCardProps {
  title: string;
  logo: React.ReactNode; // Accepts an icon or logo as a React component
  number: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, logo, number }) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 flex items-center space-x-4">
      <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-full">
        {logo}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{number}</p>
      </div>
    </div>
  );
};

export default StatsCard;
