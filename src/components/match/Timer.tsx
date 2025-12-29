interface TimerProps {
  formattedTime: string;
}

export default function Timer({ formattedTime }: TimerProps) {
  return (
    <div className="bg-surface-dark px-3 py-1.5 rounded-lg">
      <span className="text-xs font-bold text-gray-400 tracking-widest font-mono">
        {formattedTime}
      </span>
    </div>
  );
}
